"use client"

import { useEffect, useState } from "react";
import faceapi from "@/lib/face-api";

export function useFaceApi() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<Error | null>(null)

    useEffect(()=>{
        let cancelled = false;

        async function loadModels() {
            try { 

                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
                    faceapi.nets.ageGenderNet.loadFromUri("/models"),
                ]);

                if(!cancelled) setIsLoaded(true);

            } catch(err) {

                if(!cancelled) setError(err as Error);

            }
        }

        loadModels();
        return () => { cancelled = true; }
    }, [])

    return { isLoaded, error };
}