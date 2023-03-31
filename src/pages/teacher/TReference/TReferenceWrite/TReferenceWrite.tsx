import TReferenceWriteCss from "./TReferenceWriteCss";

// React-Quill
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useMemo, useRef, useState } from "react";
import TSidebar from "../../../../components/tSidebar/TSidebar";
import { useNavigate } from "react-router";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../../reducer/store";

const TReferenceWrite = () => {
    const navigate = useNavigate();
    const QuillRef = useRef<ReactQuill>();
    const user = useSelector((state: RootState) => state.user);

    const [title, setTtitle] = useState("");
    const [contents, setContents] = useState("");
    const [files, setFiles] = useState<File[]>([]);

    const contentTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTtitle(e.target.value);
    };

    const fileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = e.target.files;
        setFiles(uploadedFiles ? Array.from(uploadedFiles) : []);
    };

    const goBack = () => {
        navigate(-1);
    };

    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    ["bold", "italic", "underline", "strike"],
                    [{ size: ["small", false, "large", "huge"] }],
                    [
                        {
                            color: [
                                "black",
                                "red",
                                "orange",
                                "yellow",
                                "green",
                                "blue",
                                "purple",
                            ],
                        },
                    ],
                    [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                        { align: [] },
                    ],
                    ["link", "image"],
                ],
            },
        }),
        [],
    );

    console.log(files);

    const writeRef = async () => {
        try {
            const formData = new FormData(); // 파일을 담을 FormData 객체 생성
            const arr = new Array();
            // 파일을 formData에 append
            for (let i = 0; i < files.length; i++) {
                // let data = new FormData();
                // data.append("files", files[i]);
                arr.push(files[i]);
            }
            console.log(arr);

            const response = await axios.put(
                `http://192.168.0.62:9988/api/bbs`,
                {
                    category: "category",
                    classNo: 1,
                    content: contents,
                    teacherNo: user.no,
                    files: arr,
                    title: title,
                },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <TSidebar />
            <TReferenceWriteCss>
                <div className="section">
                    <div className="sectionTop">
                        <p>자료실 작성</p>
                    </div>
                    <div className="sectionMain">
                        <form className="title-area">
                            <textarea
                                placeholder="제목을 입력해주세요."
                                onChange={contentTitle}
                            />
                        </form>
                        <div className="content-area">
                            <ReactQuill
                                ref={element => {
                                    if (element !== null) {
                                        QuillRef.current = element;
                                    }
                                }}
                                value={contents}
                                onChange={setContents}
                                modules={modules}
                                theme="snow"
                                placeholder="내용을 입력해주세요."
                            />
                        </div>
                        <form className="file-area">
                            <input
                                type="file"
                                accept=".pdf"
                                multiple={true}
                                onChange={fileUpload}
                            />
                        </form>
                    </div>
                    <div className="sectionBt">
                        <button className="cancleBt" onClick={goBack}>
                            취소
                        </button>
                        <button className="completeBt" onClick={writeRef}>
                            완료
                        </button>
                    </div>
                </div>
            </TReferenceWriteCss>
        </>
    );
};

export default TReferenceWrite;
