import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { dbService } from '../../services/dbService';
import { useSupabase } from '../../hooks/useSupabase';

const FileDropzone = ({ file, setFile }) => {
  const { user, signInAnonymously } = useSupabase();
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      
      try {
        setIsUploading(true);
        let currentUser = user;
        if (!currentUser) {
          const { data, error } = await signInAnonymously();
          if (error) throw error;
          currentUser = data?.user;
        }
        
        if (currentUser) {
          const publicUrl = await dbService.uploadCV(selectedFile, currentUser.id);
          console.log("File uploaded successfully. Public URL:", publicUrl);
        }
      } catch (err) {
        console.error("Upload error:", err);
      } finally {
        setIsUploading(false);
      }
    }
  }, [setFile, user, signInAnonymously]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
        ${isDragActive ? 'border-indigo-500 bg-indigo-50/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-slate-300 hover:border-indigo-400 hover:bg-white/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] shrink-0 bg-white/30 backdrop-blur-md'}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4">
        {isUploading ? (
          <>
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            <div className="text-lg font-bold tracking-tight text-slate-800">Uploading...</div>
          </>
        ) : file ? (
          <>
            <CheckCircle className="w-12 h-12 text-emerald-500" />
            <div className="text-lg font-bold tracking-tight text-slate-800">{file.name}</div>
            <p className="text-sm text-slate-500">Click or drag to replace</p>
          </>
        ) : (
          <>
            <UploadCloud className={`w-12 h-12 transition-colors duration-300 ${isDragActive ? 'text-indigo-600' : 'text-slate-400'}`} />
            <div className="text-lg font-bold tracking-tight text-slate-800">
              {isDragActive ? "Drop your CV here" : "Drag & drop your CV here"}
            </div>
            <p className="text-sm text-slate-500">Supports PDF and DOCX</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileDropzone;
