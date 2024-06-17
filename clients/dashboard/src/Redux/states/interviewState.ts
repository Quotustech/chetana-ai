import { Job } from "@/src/common/interfaces/job.interface";
import { Question } from "@/src/common/interfaces/question.interface";

type InterviewState = {
  showJobModal: boolean;
  showQuestionModal: boolean;
  jobs: Job[];
  questions: Question[]
};

export const interviewState: InterviewState = {
    showJobModal: false,
    showQuestionModal: false,
    jobs: [] as Job[],
    questions: [] as Question[]
};
