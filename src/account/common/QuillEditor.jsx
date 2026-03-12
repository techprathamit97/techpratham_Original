// // components/QuillEditor.jsx

// import dynamic from 'next/dynamic';
// import 'react-quill/dist/quill.snow.css'; // Import CSS globally or here

// // 1. Dynamically import ReactQuill and disable SSR
// const ReactQuill = dynamic(
//   () => import('react-quill'),
//   { ssr: false } // 👈 This is the crucial line!
// );

// // 2. Define the toolbar modules (optional, but good practice)
// const modules = {
//   toolbar: [
//     ['bold', 'italic', 'underline', 'strike'],
//     [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//     ['link', 'clean']
//   ],
// };

// // 3. Create the wrapper component that accepts your form props
// const QuillEditor = ({ field }) => {
//   // Check if ReactQuill is loaded (it will be undefined on the server)
//   if (!ReactQuill) {
//     return <div>Loading editor...</div>;
//   }

//   return (
//     <ReactQuill 
//       theme="snow" 
//       value={field.value} 
//       onChange={field.onChange} 
//       modules={modules}
//       placeholder="Enter text here..."
//     />
//   );
// };

// export default QuillEditor;


"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false
});

const toolbarOptions = [
  [{ header: [false, 1, 2, 3, 4] }],
  [{ color: [] }, { background: [] }],
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link"],
  ["clean"]
];

const modules = {
  toolbar: toolbarOptions
};

const formats = [
  "header",
  "color",
  "background",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "link"
];

export default function QuillEditor({ field }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ReactQuill
      theme="snow"
      value={field.value || ""}
      onChange={field.onChange}
      modules={modules}
      formats={formats}
      placeholder="Write your content here..."
    />
  );
}
