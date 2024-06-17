"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/src/Redux/store";
import { useDispatch } from "@/src/Redux/store";
import { Button } from "@nextui-org/react";
import { Plus } from "lucide-react";
import FilterComponent from "../Filter/Filter";
import { getSearch } from "@/src/Redux/slices/filterSlice";
import capitalizeFirstLetter from "@/src/utils/capitalizeFirstLetter";
import { setShowJobModal, setShowQuestionModal } from "@/src/Redux/slices/interviewSlice";

interface BreadcrumbProps {
  pageName: string;
}
const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  const router = useRouter();
  const path = usePathname();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.authReducer);
  const { searchQuery } = useSelector(
    (state: RootState) => state.filterReducer
  );
  const params = pageName.split("/");

  const handleLinkClick = (clickedLink:string) => {
    const idx = params.indexOf(clickedLink);
    const link = clickedLink === ('dashboard' || 'forms') ? `/app` : `/app/${params.slice(0 , idx+1).join('/')}`;
    router.push(link)
  };

  return (
    <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/app">
              App
            </Link>
          </li>
          <li className="font-medium text-primary">
            {params.map((param, index) => {
              return (
                <span
                  key={index}
                  className="cursor-pointer"
                  onClick={()=>handleLinkClick(param)}
                >
                 {" > "+capitalizeFirstLetter(param)}
                </span>
              );
            })}
          </li>
        </ol>
      </nav>

      <div className="flex items-center gap-4">
        {(path === "/app/dashboard/departments" ||
          path === "/app/dashboard/users" ||
          path === "/app/dashboard/organizations") && (
          <input
            type="text"
            placeholder="Search Any"
            className={`p-1 border rounded-md ${
              typeof window !== "undefined" && window.innerWidth < 768
                ? "w-[13rem]"
                : "w-[18rem]"
            }  md:w-full`}
            value={searchQuery}
            onChange={(e) => dispatch(getSearch(e.target.value))}
          />
        )}
        {((user.role === "superadmin" &&
          (path === "/app/dashboard/departments" ||
            path === "/app/dashboard/users")) ||
          (user.role === "admin" && path === "/app/dashboard/users")) && (
          <div>
            <FilterComponent />
          </div>
        )}

        {(user.role === "superadmin" &&
          (path === "/app/dashboard/organizations" ||
            path === "/app/dashboard/users")) ||
        (user.role === "admin" && path === "/app/dashboard/departments") ? (
          <Button
            className="text-md px-3"
            color="primary"
            onClick={() => {
              user.role === "superadmin"
                ? path === "/app/dashboard/organizations"
                  ? router.push("/app/forms/create-organization")
                  : router.push("/app/forms/create-user")
                : router.push("/app/forms/create-department");
            }}
            title={
              user.role === "superadmin"
                ? path === "/app/dashboard/organizations"
                  ? "Add Organization"
                  : "Add User"
                : "Add Department"
            }
          >
            <Plus className=" h-5" />

            {typeof window !== "undefined" &&
              window.innerWidth > 768 &&
              (user.role === "superadmin"
                ? "Add"
                : user.role === "admin"
                ? "Add"
                : "")}
          </Button>
        ) : (
          path.includes("/forms") && (
            <Button
              className="text-md"
              color="primary"
              onClick={() => {
                user.role === "superadmin"
                  ? path === "/app/forms/create-organization"
                    ? router.push("/app/dashboard/organizations")
                    : router.push("/app/dashboard/users")
                  : router.push("/app/dashboard/departments");
              }}
            >
              Back
            </Button>
          )
        )}
         {user.role === 'superadmin' && path.includes('/jobs') && <Button
              className="text-md"
              color="primary"
              onClick={() => {
                path === "/app/dashboard/interview/jobs"
                    ? dispatch(setShowJobModal(true))
                    : dispatch(setShowQuestionModal(true))
              }}
            >
              <Plus className=" h-5" /> Add
          </Button>}
      </div>
    </div>
  );
};

export default Breadcrumb;
