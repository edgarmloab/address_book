import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
} from "@mui/material";
import DatableTable from "./DataTable";
import fieldsArr from "./fields";
import { getAllData } from "./requests";

export default function AddressBook(props) {
  const getData = (row) => {
    console.log(row, "rows data");
  };
  const [data, setData] = useState([]);
  const [saveFlag, setsaveFlag] = useState(false);

  useEffect(() => {
    getAllData().then((response) => {
      setData(response);
    });
  }, []);
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography component="h2" variant="h2">
          Address Book
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <DatableTable
          initWithoutHead
          defaultData={data}
          getData={getData}
          fieldsArr={fieldsArr}
        ></DatableTable>
      </Grid>
    </Grid>
  );
}
