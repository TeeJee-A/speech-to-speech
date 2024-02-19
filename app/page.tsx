"use client";
import { ChangeEvent, useState, MouseEvent, useEffect } from "react";
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
  const [audioTranslation, setAudioTranslation] = useState<any>(null);
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
	let data = new FormData();
 	data.append("target", language?.code!);
    data.append("file", audio![0]);
    try {
		const res = await axios({
			method: "post",
			url: "http://localhost:8000/model/speech-to-speech",
			data: data,
			responseType: 'blob',
			headers: { "Content-Type": "multipart/form-data" } 
		})
		var blob = new Blob([res.data], {type: "audio/wav"});
		console.log({blob})
		var url = URL.createObjectURL(blob);
		console.log(url);
		setAudioTranslation(url);
    } catch (error) {
      console.log({ error });
    }
  };
  useEffect(() => {}, [audioTranslation])

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
		<audio className="w-96 h-14 border" src={audioTranslation} controls></audio>
    </main>
  );
}
