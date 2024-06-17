"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { User } from "@/src/common/interfaces/user.interface";
import { Chat } from "@/src/common/interfaces/chat.interface";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { Skeleton } from "@nextui-org/react";
import { MessageCircle, Trash2 } from "lucide-react";
import dateFormatter from "@/src/utils/dateFormatter";
import Chatmodal from "../Modal/Chatmodal";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getProfileById, getUserChats } from "@/src/Redux/actions/authActions";
import { Department } from "@/src/common/interfaces/department.interface";
import { Organization } from "@/src/common/interfaces/organization.interface";
import { deleteUser } from "@/src/Redux/actions/superAdminAction";

export default function Details() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams<{ userId: string }>();
  const [userDetail, setUserDetail] = useState<User>({} as User);
  const [chats, setChats] = useState<Chat[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try{
      const id:string = params.userId;
      dispatch(getProfileById(id) as any).then((result:any) => {
        if (getProfileById.fulfilled.match(result)) {
          const payload = result.payload;
          if (payload.success) {
            setUserDetail(payload.data)
          }
        } else if (getProfileById.rejected.match(result)) {
          const err = result.payload as { response: { data: any } };
          // console.log("+++++++++++", err.response.data);
        }
      });
    }catch(error:any){
      // console.log('error while getting user data' , error)
    }finally{

      setLoading(false);
    }
  };
  const fetchUserChats = async () => {
    try{
      const id:string = params.userId;
      dispatch(getUserChats(id) as any).then((result:any) => {
        if (getUserChats.fulfilled.match(result)) {
          const payload = result.payload;
          if (payload.success) {
            setChats(payload.data)
          }
        } else if (getUserChats.rejected.match(result)) {
          const err = result.payload as { response: { data: any } };
          // console.log("+++++++++++", err.response.data);
        }
      });
    }catch(error:any){
      // console.log('error while getting user data' , error)
    }
  };

  useEffect(() => {
   
    fetchUser();
    fetchUserChats();
  }, []);

  const handleDelete = async (id: string) => {
    dispatch(deleteUser(id) as any).then((result:any) => {
      if (deleteUser.fulfilled.match(result)) {
        const payload = result.payload;
        if (payload.success) {
          toast.success(payload.message);
          router.push("/app/dashboard/users");
        }
      } else if (deleteUser.rejected.match(result)) {
        const err = result.payload as { response: { data: any } };
        // console.log("+++++++++++", err.response.data);
        toast.error(err.response.data.message);
      }
    });
  };

  return (
    <>
      <Breadcrumb pageName={`dashboard/users/${params.userId}`} />

      {showModal && (
        <Chatmodal
          showModal={showModal}
          setShowModal={setShowModal}
          selectedChat={selectedChat as Chat}
        />
      )}

      <div className=" h-[32rem] grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 2xl:gap-7.5 relative">
        <div className="bg-red-300 flex flex-col items-center gap-10 pt-6 relative shadow-black bg-white rounded-md dark:bg-[#24303F]  max-h-[32rem]">
          <Image
            src={"/images/user.png"}
            alt={"User Profile"}
            width={100}
            height={100}
          />
          <div className="flex flex-col mt-3 p-4 gap-3 max-w-[90%] text-sm md:text-base">
            <Skeleton isLoaded={!loading} className="rounded-lg min-w-[16rem] max-w-[90%]">
              <p>ID : {userDetail._id}</p>
            </Skeleton>
            <Skeleton isLoaded={!loading} className="rounded-lg min-w-[16rem] max-w-[90%]">
              <p>Name : {userDetail.name}</p>
            </Skeleton>
            <Skeleton isLoaded={!loading} className="rounded-lg min-w-[16rem] max-w-[90%]">
              <p>Email : {userDetail.email}</p>
            </Skeleton>
            <Skeleton isLoaded={!loading} className="rounded-lg min-w-[16rem] max-w-[90%]">
              <p>Department : {(userDetail.department as Department)?.name}</p>
            </Skeleton>
            <Skeleton isLoaded={!loading} className="rounded-lg min-w-[16rem] max-w-[90%]">
              <p>Organization : {(userDetail.organization as Organization)?.name} </p>
            </Skeleton>
          </div>
          <div className=" w-full text-end p-3  text-sm md:text-base">
            <Button
              color="danger"
              variant="light"
              onClick={() => handleDelete(userDetail._id)}
            >
              <Trash2 className="w-5 " /> Delete User
            </Button>
          </div>
        </div>
        <div className="bg-green-100 bg-white rounded-md dark:bg-[#24303F]  p-2 h-[32rem] overflow-y-scroll">
          <h1 className="mb-4 text-2xl">Chats</h1>
          {chats.length > 0 ? (
            chats.map((chat) => {
              return (
                <div
                  key={chat._id}
                  className="py-[.4rem] px-[.8rem] rounded-lg bg-gray dark:bg-black dark:text-white mb-2 cursor-pointer text-sm md:text-base"
                  onClick={() => {
                    setSelectedChat(chat);
                    setShowModal(true);
                  }}
                >
                  <p title={chat.question}>
                    <MessageCircle className="inline-block mr-2" />
                    {chat.question.length > 51
                      ? chat.question.slice(0, 51) + "..."
                      : chat.question}
                  </p>
                  <div className="text-end text-[.8rem]">
                    {dateFormatter(chat.createdAt)}
                  </div>
                </div>
              );
            })
          ) : (
            <h1 className="text-center mt-12">No Chats To Show .</h1>
          )}
        </div>
      </div>
    </>
  );
}
