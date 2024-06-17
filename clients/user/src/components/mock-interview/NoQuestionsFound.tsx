import React from "react";

interface NoQuestions {
  children?: React.ReactNode;
  role?: string;
}

const NoQuestionsFound = ({ children, role }: NoQuestions) => {
  // console.log("__Role", role);
  // if (role === "AI/ML Developer") {
    
  //  role = role.split("%20")[0].split("%26").join("/")+ " " + role.split("%20")[1]
  // }
  return (
    <section className="background-radial-gradient flex min-h-screen justify-center pb-5 pr-3 pt-3 text-white">
      <div className="background-radial-gradient md:h[50vh] w-[90%] sm:h-screen  md:ml-5 md:mt-2   md:w-[95%]  lg:h-[100vh]">
        {children ? (
          children
        ) : (
          <h1 className="text-white text-2xl" >
            No questions has been set for {" "}
            {role ? role : " this role"}
          </h1>
        )}
      </div>
    </section>
  );
};

export default NoQuestionsFound;
