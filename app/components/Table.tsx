"use client"

import React, {useEffect} from 'react';
import {Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import { Info } from "../structs/Info";
import { VictoryDrawLoss } from '../structs/VictoryDrawLoss';

type Row = {
    id: string;
    name: string;
    victories: number;
    draws: number;
    losses: number;
    points: number;
};

interface TableProps {
    data: {[id:string]: Info};
    updateSelected: (selected: string[]) => void
}

const MyTable: React.FC<TableProps> = ({data, updateSelected}) => {

    const [selected, setSelected] = React.useState<string[]>([]);
    const [rows, setRows] = React.useState<Row[]>([]);

    const [results, setResults] = React.useState<VictoryDrawLoss[]>([]);

    useEffect(() => {

        let temp: VictoryDrawLoss[] = [];

        for (const [key, value] of Object.entries(data)){
            temp.push(value.results[0]);
        }

        temp.sort((a, b) => {
            return b.points - a.points;
        });

        console.log(temp);

        setRows(() => temp.map((e, i) => {
            return {
                id: e.team,
                name: e.team,
                victories: e.victories,
                draws: e.draws,
                losses: e.losses,
                points: e.points
            }
        }));
    }, []);

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.id);
            setSelected(newSelecteds);
            updateSelected(newSelecteds);
            return;
        }
        setSelected([]);
        updateSelected([]);
    };

    const handleClick = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
        updateSelected(newSelected);
    };

    const isSelected = (id: string) => selected.indexOf(id) !== -1;

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={selected.length > 0 && selected.length < rows.length}
                                checked={rows.length > 0 && selected.length === rows.length}
                                onChange={handleSelectAllClick}
                            />
                        </TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>V</TableCell>
                        <TableCell>D</TableCell>
                        <TableCell>L</TableCell>
                        <TableCell>P</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, i) => {
                        const isItemSelected = isSelected(row.id);
                        return (
                            <TableRow
                                key={row.id}
                                selected={isItemSelected}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isItemSelected}
                                        onChange={(event) => handleClick(event, row.id)}
                                    />
                                </TableCell>
                                <TableCell width="10%">{row.name}</TableCell>
                                <TableCell width="10%">{row.victories}</TableCell>
                                <TableCell width="10%">{row.draws}</TableCell>
                                <TableCell width="10%">{row.losses}</TableCell>
                                <TableCell width="10%">{row.points}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default MyTable;