import { Job } from 'kue';
import queue from "../config/kue";
import sendMail from '../utils/sendmail';

// Function to define and start email processing logic
export default function startEmailProcessing(taskType: string): void {
    // Define your email processing logic
    queue.process(taskType, (job: Job, done: () => void) => {
        // Simulate sending email
        sendMail(job.data);

        // Once email processing is complete, call done() to notify Kue
        done();
    });

    // Log a message when the queue starts processing jobs
    queue.on('start', () => {
        console.log('Queue is now processing jobs');
    });

    // Log a message when a job completes processing
    queue.on('job complete', (id: number) => {
        console.log(`Job ${id} completed`);
    });
}