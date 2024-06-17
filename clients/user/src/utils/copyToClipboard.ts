import { toast } from "sonner";
import * as clipboard from "clipboard-polyfill";
export const copyToClipboard = (text: string , setState?: React.Dispatch<React.SetStateAction<boolean>>): void =>{
    clipboard.writeText(text)
      .then(() => {
        toast.info('Copied To Clipboard.');
        if(setState){

          setTimeout(() => {
            setState(false);
          }, 4000);
        }
      })
      .catch(err => {
        toast.error('Error while copying...')
      });
      setState ? setState(true) : null;
}