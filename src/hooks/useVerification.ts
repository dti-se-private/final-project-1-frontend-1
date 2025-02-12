import {useDispatch} from "react-redux";
import {verificationApi, VerificationSendRequest} from "@/src/stores/apis/verificationApi";

export const useVerification = () => {
    const dispatch = useDispatch();
    const [sendApiTrigger] = verificationApi.useSendMutation();

    const send = async (request: VerificationSendRequest) => {
        const sendApiResult = await sendApiTrigger(request).unwrap();
        return sendApiResult;
    }

    return {
        send,
    };
}
