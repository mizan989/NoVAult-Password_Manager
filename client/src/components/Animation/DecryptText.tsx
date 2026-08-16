import React, { useEffect, useState, useRef } from "react";

interface DecryptTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  className?: string;
  characters?: string;
  trigger?: boolean;
  onComplete?: () => void;
}

const DEFAULT_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*";

export default function DecryptText({
  text,
  speed = 30,
  maxIterations = 10,
  className = "",
  characters = DEFAULT_CHARS,
  trigger = true,
  onComplete,
}: DecryptTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const iterationRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!trigger) {
      setDisplayText(text);
      return;
    }

    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        return text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join("");
      });

      iteration += 1 / (maxIterations / text.length || 1);

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        onComplete?.();
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, trigger, speed, maxIterations, characters, onComplete]);

  return <span className={`font-mono ${className}`}>{displayText}</span>;
}
