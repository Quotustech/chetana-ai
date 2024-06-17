const extractFeedbackInfo = (input: string): { feedbackOnAnswer: string, feedbackOnCommunication: string, score: number, communicationScore: number } => {
    const regex = /#FeedbackOnAnswer:\s*([^]+?)\s*_\$\$_\s*#FeedbackOnCommunication:\s*([^]+?)\s*_\$\$_\s*#Score=(\d+)\s*_\$\$_\s*#CommunicationScore=(\d+)/;

    const match = input.match(regex);

    if (!match) {
        // throw new Error("Invalid input string format");
        const feedbackOnAnswer = "";
        const feedbackOnCommunication = "";
        const score = 0;
        const communicationScore = 0;
        return { feedbackOnAnswer, feedbackOnCommunication, score, communicationScore };
    }

    const feedbackOnAnswer = match[1].trim() || "";
    const feedbackOnCommunication = match[2].trim() || "";
    const score = parseInt(match[3]) || 0;
    const communicationScore = parseInt(match[4]) || 0;

    return { feedbackOnAnswer, feedbackOnCommunication, score, communicationScore };
}

export default extractFeedbackInfo