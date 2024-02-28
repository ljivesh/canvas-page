import { useState, useEffect } from 'react';
import axios from 'axios';
import { SpeechConfig } from 'microsoft-cognitiveservices-speech-sdk';

export async function getTokenOrRefresh() {
    try {
        const res = await axios.get('/get-speech-token');
        const token = res.data.token;
        const region = res.data.region;
        // console.log('Token fetched from back-end: ' + token);
        return { authToken: token, region: region };
    } catch (err) {
        console.log(err.response.data);
        return { authToken: null, error: err.response.data };
    }
}

export const useSpeechConfig = () => {

    const [speechConfig, setSpeechConfig] = useState(null);

    useEffect(() => {
        const refreshConfig = async () => {
            const { authToken, region } = await getTokenOrRefresh();
            const config = SpeechConfig.fromAuthorizationToken(authToken, region);

            config.speechRecognitionLanguage = 'en-US';
            setSpeechConfig(config);
        };
         // Fetch the token immediately
         refreshConfig();

         // Then fetch the token every 9 minutes (540 seconds)
         // Adjust the interval as needed based on the token's actual expiration time
         const intervalId = setInterval(refreshConfig, 540 * 1000);
 
         // Clear the interval when the component is unmounted
         return () => clearInterval(intervalId);
    }, []);

    return { speechConfig };
}