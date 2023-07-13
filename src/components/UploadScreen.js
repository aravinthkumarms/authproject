import React, { useState, useRef } from 'react';
import axios from 'axios';
import { LinearProgress } from '@mui/material';
import { ImageConfig } from '../config/ImageConfig'
import uploadImg from '../assets/cloud-upload-regular-240.png';
import { Box } from '@mui/material';
import { protectedResources } from '../authConfig';
import { msalInstance } from "../index";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useMsal } from "@azure/msal-react";


const UploadScreen = () => {

    const [state, setState] = React.useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });

    const { vertical, horizontal, open } = state;
    const { instance } = useMsal();
    const account = instance.getActiveAccount();
    const getToken = async () => {
        const account = msalInstance.getActiveAccount();

        if (!account) {
            throw Error("No active account! Verify a user has been signed in and setActiveAccount has been called.");
        }

        const response = await msalInstance.acquireTokenSilent({
            account: account,
            ...protectedResources.apiTodoList.scopes
        });

        return response.accessToken;
    }
    const wrapperRef = useRef(null);

    const [fileList, setFileList] = useState([]);
    const [files, setFiles] = React.useState([]);

    const [progress, setProgress] = useState(0);

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');

    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

    const onDrop = () => wrapperRef.current.classList.remove('dragover')

    const onFileChange = (files) => {
        setFiles(files);

    }

    const handleClose = (event, reason) => {
        setState({ ...state, open: false });
    };

    const onFileDrop = async (e) => {
        const accessToken = await getToken();
        const newFile = e.target.files[0];
        e.preventDefault();
        if (newFile) {
            const updatedList = [...fileList, newFile];
            setFileList(updatedList);
            onFileChange(updatedList);
            const formData = new FormData();
            formData.append('file', (newFile));
            formData.append('owner', account.name);
            const config = {
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    let percent = Math.floor((loaded * 100) / total);
                    console.log(`${loaded}kb of ${total}kb | ${percent}%`);
                    setProgress(percent);
                },
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
            axios.post(protectedResources.apiTodoList.upload, formData, config).then(res => {
                if (res.status === 200) {
                    console.log(res.data);
                    setState({
                        open: true,
                        vertical: 'center',
                        horizontal: 'center',
                    });
                }
            }).catch(err => {
                console.log(accessToken);
                console.log(err);
                console.log(files)
            }
            )
        }


    }



    const fileRemove = (file) => {
        const updatedList = [...fileList];
        updatedList.splice(fileList.indexOf(file), 1);
        setFileList(updatedList);
        onFileChange(updatedList);
        // const delURL = "http://localhost:8080/delete";
        const delData = new FormData();
        delData.append('filename', (fileList[0].name));
        console.log(delData)
        // const config = {
        //     headers: {
        //         'content-type': 'multipart/form-data'
        //     }
        // }

        // axios.post(delURL, delData, config).then(res => {
        //     if (res.status === 200) {
        //         console.log(res)

        //     }
        //})
    }
    return (
        <>
            <Box sx={{
                justifyContent: 'center',
                display: 'flex',
            }}>
                {
                    fileList.length !== 1 ?
                        (
                            <>

                                <div
                                    ref={wrapperRef}
                                    className="drop-file-input"
                                    onDragEnter={onDragEnter}
                                    onDragLeave={onDragLeave}
                                    onDrop={onDrop}
                                >
                                    <div>
                                        <div className="drop-file-input__label">
                                            <img src={uploadImg} alt="" />
                                            <p>Upload Your Resume</p>
                                        </div>
                                        <input type="file" onChange={onFileDrop} />
                                    </div>
                                </div>
                            </>
                        ) : null
                }
                {
                    fileList.length > 0 &&
                    <div className="drop-file-preview">
                        {
                            fileList.map((item, index) => (
                                <div key={index} className="drop-file-preview__item">
                                    <img src={ImageConfig[item.type.split('/')[1]] || ImageConfig['default']} alt="" />
                                    <div className="drop-file-preview__item__info">
                                        <p>{item.name}</p>
                                        <p>{(item.size / 1024).toFixed(2)}KB</p>
                                        {progress > 0 &&
                                            <LinearProgress variant="determinate" value={progress} sx={{ width: "300px", margin: "auto" }} />
                                        }
                                    </div>
                                    <span className="drop-file-preview__item__del" onClick={() => fileRemove(item)}>x</span>

                                </div>

                            ))
                        }
                        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}
                            anchorOrigin={{ vertical, horizontal }} key={vertical + horizontal}>
                            <Alert onClose={handleClose} severity="success" variant='filled'>
                                File Uploaded Successfully!
                            </Alert>
                        </Snackbar>
                    </div>
                }
            </Box>


        </>
    );
}


export default UploadScreen;
