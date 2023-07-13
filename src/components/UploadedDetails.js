
import React, { useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/system';

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateVal } from '../redux/Reducer';

export const UploadedDetails = () => {

    const dispatch = useDispatch();
    useEffect(() => {
        let mounted = true;
        axios.get('api/upload').then(res => {
            if (mounted) {
                dispatch(updateVal(res.data));
            }
        }
        )
        return () => mounted = false;
    }, [])
    const data = useSelector(state => state.url.data);
    return (
        <>
            <Box
                display="flex"
                justifyContent="center"
                width="800px"
                margin="auto"
            >
                <TableContainer component={Paper}>
                    <Table sx={{ maxWidth: 800 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>File Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Path</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((i) => (
                                <TableRow
                                    key={i.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {i.name}
                                    </TableCell>
                                    <TableCell align="right">{i.url}</TableCell>
                                </TableRow>
                            )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

        </>
    )
}