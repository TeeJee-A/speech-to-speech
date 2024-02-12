"use client";

import { ChangeEvent, useState, MouseEvent } from "react";
import axios from "axios";

const allLanguages = [
  {
    code: "eng",
    language: "English",
  },
  {
    code: "arb",
    language: "Modern Standard Arabic",
  },
  {
    code: "fra",
    language: "French",
  },
  {
    code: "rus",
    language: "Russian",
  },
  {
    code: "kor",
    language: "Korean",
  },
];

interface languageType {
  code: string;
  language: string;
}

export default function Home() {
  const [audio, setAudio] = useState<FileList>();
  const [language, setLanguage] = useState<languageType>();
  const [open, setOpen] = useState(false);

  const audioFile = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!event.target.files) return;
    setAudio(event.target?.files);
  };

  const handleLanguage = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setOpen(!open);
  };

  const handleClickedLanguage = (
    event: MouseEvent<HTMLButtonElement>,
    code: string,
    name: string
  ) => {
    event.preventDefault();
    setOpen(false);
    setLanguage({ code, language: name });
  };

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const audioData = new FormData();
    audioData.append("file", audio![0]);
    const languageData = new FormData();
    languageData.append("target", language?.code!);
    try {
      const res = await axios.post("", { //endpoint
        audioData,
        languageData,
      });
      console.log({ res });
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form className="space-y-3 flex justify-center items-center flex-col">
        <label
          htmlFor="inputAudio"
          className="w-80 flex flex-col justify-center items-center text-black cursor-pointer h-32 rounded-[30px] bg-white"
        >
          {" "}
          upload Audio
          {audio && <span className="text-black">{audio[0].name}</span>}
          <input
            id="inputAudio"
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(event) => audioFile(event)}
          />
        </label>
        <button
          className="text-white  w-full bg-transparent border h-10 rounded-full px-5"
          onClick={(event) => handleLanguage(event)}
        >
          {language?.language || "Choose Language"}
        </button>
        {open && (
          <div className="text-white w-full bg-transparent border p-3 rounded-[30px] flex justify-center items-center flex-col space-y-3">
            {allLanguages.map((items, index) => (
              <button
                onClick={(event) =>
                  handleClickedLanguage(event, items.code, items.language)
                }
                key={index}
                className="text-white"
              >
                {items.language}
              </button>
            ))}
          </div>
        )}
        <div className="w-full flex justify-end items-center">
          <button
            onClick={(event) => handleSubmit(event)}
            className="bg-white w-32 h-10 rounded-full text-black"
          >
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}
