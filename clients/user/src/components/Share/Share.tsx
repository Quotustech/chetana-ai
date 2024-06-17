"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch } from "@/redux/store";
import { getAllChatByGroupId } from "@/redux/slices/chat/chatActions";
import { Chat } from "@/common/interfaces/chat.interface";
import Response from "../Response/Response";
import { useNavbarContext } from "@/contexts/NavbarContext";

type Props = {};

const Share = (props: Props) => {
  const dispatch = useDispatch();
  const params = useParams<{ groupId: string }>();
  const [sharedChats, setSharedChats] = useState<Chat[]>([]);
  const { expanded, setExpanded } = useNavbarContext();

  useEffect(() => {
    const fetchChats = async () => {
      await dispatch(getAllChatByGroupId(params.groupId)).then((result:any) => {
        setSharedChats(result.payload.data as Chat[]);
      });
    };
    fetchChats();
  }, []);
  return (
  <div id="share" className={`${expanded ? 'navbar-expanded' : 'navbar-collapsed'} relative mb-4 flex h-svh flex-col items-center gap-8 overflow-y-scroll p-3`}>
     {sharedChats.map((chat, index)=>{
      return <Response key={chat._id || index} data={chat} />
     })}
  </div>
  );
};

export default Share;
