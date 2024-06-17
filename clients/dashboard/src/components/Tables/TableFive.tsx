"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch } from "@/src/Redux/store";
import { useRouter } from "next/navigation";
import { Organization } from "@/src/common/interfaces/organization.interface";

import { RootState } from "@/src/Redux/store";
import { useSelector } from "react-redux";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Pagination } from "@nextui-org/react";
import Apikeymodal from "../Modal/Apikeymodal";

import capitalizeFirstLetter from "@/src/utils/capitalizeFirstLetter";

import { Check, X } from "lucide-react";
import { User } from "@/src/common/interfaces/user.interface";
import { Department } from "@/src/common/interfaces/department.interface";
import toast from "react-hot-toast";
import {
  getAllChats,
  getAllDepts,
  getAllOrgs,
  getAllUsers,
} from "@/src/Redux/actions/superAdminAction";
import {
  getOrgDepartments,
  getOrgUsers,
  getOrgUsersChats,
} from "@/src/Redux/actions/organizationAction";
import {
  approveUser,
  getDeptUsers,
  getDeptUsersChats,
  rejectUser,
} from "@/src/Redux/actions/departmentAction";

interface Column {
  name: string;
}
interface TableProps {
  columns: Column[];
  type: string;
}
interface RoleData {
  admin: {
    users: User[];
    approvals: User[];
    departments: Department[];
  };
  superadmin: {
    organizations: Organization[];
    approvals: Department[];
    users: User[];
    departments: Department[];
  };
  deptadmin: {
    approvals: User[];
    users: User[];
  };
}

const TableFive: React.FC<TableProps> = ({ columns, type }) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [deptData, setDeptData] = useState<{} | Department>({} as Department);
  const rowsPerPage = 8;

  //getting all required state from store
  const { organizations, users, approvedDepts, pendingDepts } = useSelector(
    (state: RootState) => state.superAdminReducer
  );
  const { allDepartments, orgUsers } = useSelector(
    (state: RootState) => state.organizationReducer
  );
  const { pendingUsers, approvedUsers } = useSelector(
    (state: RootState) => state.departmentReducer
  );
  const { user } = useSelector((state: RootState) => state.authReducer);
  const { orgs, depts, searchQuery } = useSelector(
    (state: RootState) => state.filterReducer
  );

  const dispatch = useDispatch();

  //to approve the user
  const handleUserApprove = async (id: string) => {
    try {
      dispatch(
        approveUser({
          userId: id,
          deptId: user._id,
          orgId: user.organization as string,
        })
      ).then((result) => {
        if (approveUser.fulfilled.match(result)) {
          const payload = result.payload;
          if (payload.success) {
            toast.success(payload.message);
          }
        } else if (approveUser.rejected.match(result)) {
          const err = result.payload as { response: { data: any } };
          // console.log("+++++++++++", err.response.data);
          toast.error(err.response.data.message);
        }
      });
    } catch (error: any) {
      // console.log("error while approving the user", error);
    }
  };

  //to reject the user
  const handleUserReject = async (id: string) => {
    try {
      dispatch(rejectUser(id)).then((result) => {
        if (rejectUser.fulfilled.match(result)) {
          const payload = result.payload;
          if (payload.success) {
            toast.success(payload.message);
          }
        } else if (rejectUser.rejected.match(result)) {
          const err = result.payload as { response: { data: any } };
          // console.log("+++++++++++", err.response.data);
          toast.error(err.response.data.message);
        }
      });
    } catch (error: any) {
      // console.log("error while approving the user", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user.role === "admin") {
        dispatch(getOrgUsers(user._id));
        dispatch(getOrgDepartments(user._id));
        dispatch(getOrgUsersChats(user._id));
      } else if (user.role === "superadmin") {
        dispatch(getAllOrgs());
        dispatch(getAllUsers());
        dispatch(getAllDepts());
        dispatch(getAllChats());
      } else if (user.role === "deptadmin") {
        dispatch(getDeptUsers(user._id));
        dispatch(getDeptUsersChats(user._id));
      }
    };

    fetchData();
  }, [user]);

  //this returns conditional user || organization || department  array to map in the table
  const tableData = useCallback((): (User | Organization | Department)[] => {
    const roleData: RoleData = {
      admin: {
        users: orgUsers,
        approvals: orgUsers,
        departments: allDepartments,
      },
      superadmin: {
        organizations: organizations,
        approvals: pendingDepts,
        users: users,
        departments: approvedDepts,
      },
      deptadmin: {
        approvals: pendingUsers,
        users: approvedUsers,
      },
    };

    return (
      ((roleData as any)[user.role]?.[type] as (
        | User
        | Organization
        | Department
      )[]) || []
    );
  }, [
    user.role,
    type,
    orgUsers,
    allDepartments,
    organizations,
    pendingDepts,
    users,
    approvedDepts,
    pendingUsers,
    approvedUsers,
  ]);

  //filter controll
  const filteredData = useCallback(() => {
    let itemsArray: (User | Organization | Department)[] = [...tableData()];
    if (orgs.length > 0) {
      // console.log(">>>>>>>>>", itemsArray);
      let temp = orgs.map((orgName) => {
        let tempArray = itemsArray.filter((el) => {
          if ("organization" in el && typeof el.organization !== "string") {
            return el.organization.name === orgName;
          }
          return false;
        });
        return tempArray;
      });
      itemsArray = temp.flat();
    }
    if (depts.length > 0) {
      let temp = depts.map((deptName) => {
        // console.log(">>>>>>>>>", itemsArray);
        let tempArray = itemsArray.filter((el) => {
          if ("department" in el && typeof el.department !== "string") {
            return el.department.name === deptName;
          } else {
            return el.name === deptName;
          }
          return false;
        });
        return tempArray;
      });
      itemsArray = temp.flat();
    }
    if (searchQuery.trim()) {
      itemsArray = itemsArray.filter((obj) => {
        // Checking if any key's value includes the search string
        return Object.values(obj).some((value) => {
          if (typeof value === "string") {
            return value
              .toLowerCase()
              .includes(searchQuery.trim().toLowerCase());
          }
          return false;
        });
      });
    }
    return itemsArray;
  }, [orgs, depts, searchQuery, tableData]);

  //pagination controll
  const pages = Math.ceil(filteredData().length / rowsPerPage);

  const items = useMemo(() => {
    if (pages < page) {
      setPage(1);
    }
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredData().slice(start, end);
  }, [page, filteredData]);

  return (
    <>
      {showModal && (
        <Apikeymodal
          setShowModal={setShowModal}
          showModal={showModal}
          deptData={deptData as Department}
          setDeptData={setDeptData}
        />
      )}
      <Table
        aria-label="  table"
        className={
          type === "approvals "
            ? "approval h-[23.7rem]  shadow-xl"
            : "approval max-h-[29rem] min-h-[23.7rem] shadow-xl"
        }
      >
        <TableHeader className="sticky  top-0">
          {columns.map((el, idx) => (
            <TableColumn key={idx} className="text-[1rem] py-1">
              {capitalizeFirstLetter(el.name)}
            </TableColumn>
          ))}
        </TableHeader>
        {(type === "approvals" ? tableData() : items).length > 0 ? (
          <TableBody>
            {(type === "approvals" ? tableData() : items).map(
              (rowData, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={`${
                    type === "approvals" || type === "users"
                      ? "hover:bg-gray hover:text-black border-b-1 border-[#d9d9d9]"
                      : "border-b-1 border-[#d9d9d9]"
                  }`}
                  onClick={() => {
                    if (rowData.role === "user" && type !== "approvals") {
                      router.push(`/app/dashboard/users/${rowData._id}`);
                    }
                  }}
                >
                  {columns.map((column, colIndex) => {
                    if (column.name === "action" && user.role === "deptadmin") {
                      return (
                        <TableCell key={colIndex}>
                          <Check
                            className="inline mr-4 text-success cursor-pointer"
                            onClick={() => handleUserApprove(rowData._id)}
                          />
                          <X
                            className="inline text-danger cursor-pointer"
                            onClick={() => handleUserReject(rowData._id)}
                          />
                        </TableCell>
                      );
                    }

                    if (column.name === "sl.no") {
                      const serialNumber =
                        (page - 1) * rowsPerPage + rowIndex + 1;

                      return (
                        <TableCell
                          key={colIndex}
                          className={`${
                            type === "approvals" || type === "users"
                              ? "cursor-pointer text-[.8rem] py-1 pl-6"
                              : "text-[.8rem] py-1 cursor-default pl-6"
                          }`}
                        >
                          {serialNumber}
                        </TableCell>
                      );
                    }

                    return (
                      <TableCell
                        key={colIndex}
                        title={(rowData as any)[column.name]}
                        className={`${
                          (type === "approvals" || type === "users") &&
                          "cursor-pointer"
                        } " text-[.8rem] py-3 max-w-40 h-8 whitespace-nowrap overflow-hidden " ${
                          column.name === "status" &&
                          ((rowData as any)[column.name] === "approved"
                            ? "text-success  p-1 m-2"
                            : (rowData as any)[column.name] === "pending"
                            ? "text-warning"
                            : "text-danger")
                        }`}
                        onClick={() => {
                          if (
                            type === "approvals" &&
                            user.role === "superadmin"
                          ) {
                            console.log("row data", rowData);
                            setDeptData(rowData);
                            setShowModal(!showModal);
                          }
                        }}
                      >
                        {column.name === "organization"
                          ? (rowData as any)[column.name]?.name
                          : column.name === "department"
                          ? (rowData as any)[column.name]?.name
                          : (rowData as any)[column.name]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              )
            )}
          </TableBody>
        ) : (
          <TableBody emptyContent={"No Data to display."}>{[]}</TableBody>
        )}
      </Table>
      {type !== "approvals" && filteredData().length > 8 && (
        <div className="w-full mt-3 flex md:justify-end justify-center">
          <Pagination
            showControls
            showShadow
            size="sm"
            color="primary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      )}
    </>
  );
};
export default TableFive;
