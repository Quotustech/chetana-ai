import { NextFunction, Request, Response } from "express";
import Chat from "../../model/chatModel";
import User from "../../model/userModel";
import dotenv from "dotenv";
import { CatchAsyncError } from "../../middleware/catchAsyncError";
import OpenAI from "openai";
import Organization from "../../model/organizationModel";
import Department from "../../model/departmentModel";
import mongoose from "mongoose";
import ErrorHandler from "../../utils/ErrorHandler";

dotenv.config();

const chatApiUrl = process.env.CHAT_GPT_API_KEY as string;
const transpilerApiKey = process.env.TRANSPILER_API_KEY as string;
const mockInterviewApiKey = process.env.MOCK_INTERVIEW_API_KEY as string;

const apiKeys: Record<string, string> = {
  CHAT_KEY: chatApiUrl,
  TRANSPILER_KEY: transpilerApiKey,
  MOCK_INTERVIEW_KEY: mockInterviewApiKey,
};
const systemMessage: OpenAI.Chat.Completions.ChatCompletionSystemMessageParam = {
  role: "system",
  content:
    "Techmate is a helpful chatbot dedicated to computer science topics. your excellence in answering queries related to coding, algorithms, data structures, and more. However, you sholud kindly don't answer to the non-technical questions which is not directly related to computer science i.e not related to computer science. strictly don't answer to that questions which is not directly related to computer science. Additionally, you also assist in transpiling code from one programming language to another. If there's a need for code in response, you should always provide it within code blocks or fences, suitable for Markdown parsers.",
}
let messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [systemMessage];
let prevGroupId = "" ;
export const sendMessageToChatGPT = CatchAsyncError(
  async (req: Request, res: Response , next: NextFunction) => {
      const { userId, message, groupId, apiKeyName, instruction } = req.body;

      if(prevGroupId !== groupId){
        prevGroupId = groupId;
        messages = [systemMessage];
      }

      if (!apiKeyName || !apiKeys[apiKeyName]) {
        const err = new ErrorHandler("Invalid or missing API key name", 400);
        return next(err);
      }

      const openai = new OpenAI({
        apiKey: apiKeys[apiKeyName],
      });

      if (userId && groupId) {

        const user = await User.findById(userId);
        if (!user) {
          const err = new ErrorHandler("User not found", 404);
          return next(err);
        }

        if (message) {
          const userMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam =
          {
            role: "user",
            content: message,
          };
          messages.push(userMessage);
        }

        const response = await openai.chat.completions.create({
          model: "ft:gpt-3.5-turbo-1106:quotus::9MYcPBNv",
          messages,

          stream: true,
        });

        let answerContent = "";

        for await (const chunk of response) {
          const streamedString = chunk.choices[0]?.delta?.content || "";
          answerContent += streamedString;
          res.write(streamedString);
        }

        res.end();

        const followUpMessage: OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam =
        {
          role: "assistant",
          content: answerContent,
        };
        messages.push(followUpMessage);
        // console.log('messages-------> ' , messages);
        const newChat = new Chat({
          user: userId,
          question: message,
          answer: answerContent,
          groupId,
        });
        await newChat.save();
      } else {
        if (!instruction) {
          const err = new ErrorHandler("Instruction is missing.", 400);
          return next(err);
        }
        if (message && instruction) {
          const response = await openai.chat.completions.create({
            model: "ft:gpt-3.5-turbo-1106:quotus::9MYcPBNv",
            messages: [
              {
                role: "system",
                content: instruction,
              },
              {
                role: "user",
                content: message,
              }
            ],

            stream: true,
          });


          let answerContent = "";

          for await (const chunk of response) {
            const streamedString = chunk.choices[0]?.delta?.content || "";
            answerContent += streamedString;
            res.write(streamedString);
          }

          res.end();
        } else {
          const err = new ErrorHandler("Either message or instruction is missing", 400);
          return next(err);
        }
      }
  }
);

export const getChatByUser = CatchAsyncError(
  async (req: Request, res: Response , next:NextFunction) => {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        const err = new ErrorHandler("User not found", 404);
        return next(err);
      }
      const chats = await Chat.find({ user: userId }).exec();
      if (!chats || chats.length === 0) {
        const err = new ErrorHandler("Chat not found", 404);
        return next(err);
      }
      res.status(200).json({
        success: true,
        message: 'Chats retrieved successfully.',
        data: chats
      });
  }
);

export const getAllChat = CatchAsyncError(
  async (req: Request, res: Response, next:NextFunction) => {
      const chats = await Chat.find().populate("user");
      if (!chats || chats.length === 0) {
        const err = new ErrorHandler("Chats not found", 404);
        return next(err);
      }
      res.status(200).json({
        success: true,
        message: 'Chats retrieved successfully.',
        data: chats
      });
  }
);

export const getAllChatByChatGroup = CatchAsyncError(
  async (req: Request, res: Response , next:NextFunction) => {
      const {groupId} = req.params;
      const chats = await Chat.find({groupId});
      if (!chats || chats.length === 0) {
        // return res.status(404).json({ error: "Chats not found" });
        const err = new ErrorHandler("Chats not found", 404);
        return next(err);
      }
      res.status(200).json({
        success: true,
        message: 'Chats retrieved successfully.',
        data: chats
      });
  }
);

export const getAllChatByOrgId = CatchAsyncError(
  async (req: Request, res: Response , next:NextFunction) => {
      const orgId = req.params.orgId;
      const organization = await Organization.findById(orgId);
      if(!organization){
        const err = new ErrorHandler("Organization not found.", 404);
        return next(err);
      }

      const chats = await Chat.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $addFields: {
            user: { $arrayElemAt: ["$user", 0] } // Convert user array to object
          }
        },
        {
          $match: {
            "user.organization": new mongoose.Types.ObjectId(orgId)
          }
        }
      ]);
      if (!chats || chats.length === 0) {
        const err = new ErrorHandler("Chats not found", 404);
        return next(err);
      }
      res.json({
        success: true,
        message: 'Chats retrieved successfully.',
        data: chats
      });
  }
);

export const getAllChatByDeptId = CatchAsyncError(async (req: Request, res: Response , next:NextFunction) => {
    const deptId = req.params.deptId;

    // Check if the department exists
    const department = await Department.findById(deptId);
    if (!department) {
      const err = new ErrorHandler("Department not found.", 404);
        return next(err);
    }

    // Aggregate to find chats for the specified department
    const chats = await Chat.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $addFields: {
          user: { $arrayElemAt: ["$user", 0] } // Convert user array to object
        }
      },
      {
        $match: {
          "user.department": new mongoose.Types.ObjectId(deptId)
        }
      }
    ]);

    if (!chats || chats.length === 0) {
      const err = new ErrorHandler("Chats not found", 404);
      return next(err);
    }

    res.json({
      success: true,
      message: 'Chats retrieved successfully.',
      data: chats
    });
});

