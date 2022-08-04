import React, { useEffect, useState } from "react";
import {
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  withStyles,
  createStyles,
} from "@mui/material";
import classNames from "classnames";
import { postNewEntry, deleteEntry, updateEntry } from "./requests";

const Input = ({
  name,
  error,
  validation,
  childHasError,
  columnDataArr,
  value,
  classes,
  tableName,
  ...props
}) => {
  const [hasError, setError] = useState(false);
  const handleOnChange = (e) => {
    const hasError = validation(e, columnDataArr);
    if (!hasError) {
      childHasError(true);
      setError(true);
    } else {
      childHasError(false);
      setError(false);
    }
    props.onChange(e);
  };

  return (
    <>
      <div
        className={classNames(
          classes.inputWrapperDiv,
          `inputWrapperDiv${tableName}`
        )}
      >
        <input
          className={classNames(classes.input, `input${tableName}`)}
          name={name}
          value={value || ""}
          onChange={handleOnChange}
        />
        <p className={classNames(classes.error, `error${tableName}`)}>
          {hasError && error}
        </p>
      </div>
    </>
  );
};

const OurSelect = ({
  name,
  value,
  selectMessage,
  options,
  classes,
  tableName,
  ...props
}) => {
  const handleSelect = (e) => {
    props.onChange(e);
  };
  return (
    <FormControl
      className={classNames(
        classes.selectFormControl,
        `selectFormControl_${tableName}`
      )}
    >
      <InputLabel
        className={classNames(
          classes.selectInputLabel,
          `selectInputLabel_${tableName}`
        )}
        htmlFor={name}
      >
        {selectMessage}
      </InputLabel>
      <Select
        className={classNames(classes.select, `select_${tableName}`)}
        value={value || ""}
        onChange={handleSelect}
        inputProps={{
          name: name,
          id: name,
        }}
      >
        {(options || []).map((item) => {
          return (
            <MenuItem
              className={classNames(
                classes.selectMenuItem,
                `selectMenutItem_${tableName}`
              )}
              key={item.value}
              value={item.value}
            >
              {item.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
const EditableRow = ({
  fieldsArr = [],
  editData = {},
  allRowsData,
  tableName,
  classes = {},
  editingIndex,
  isEditing,
  selectClasses,
  inputClasses,
  ...props
}) => {
  let initializeObj = {};
  fieldsArr.forEach((item) => {
    initializeObj[item.name] = "";
  });
  const [rowHasError, setRowHasError] = useState(false);
  const [rowData, setRowData] = useState(
    editData ? Object.assign({}, initializeObj, editData) : initializeObj
  );
  const handleSave = () => {
    props.handleSave(rowData);
  };
  const handleOnChange = (e) => {
    const updatedData = Object.assign({}, rowData, {
      [e.target.name]: e.target.value,
    });
    setRowData(updatedData);
  };
  const handleCancel = () => {
    if (isEditing) {
      props.handleCancel(editingIndex);
    } else {
      props.handleCancel();
    }
  };
  return (
    <TableRow
      className={classNames(classes.tableBodyRow, `tableBodyRow_${tableName}`)}
    >
      {fieldsArr.map((item, i) => {
        return (
          <TableCell
            className={classNames(
              classes.tableBodyCell,
              `tableBodyCell_${tableName}`
            )}
            key={i}
          >
            {item.type === "select" ? (
              <OurSelect
                tableName={tableName}
                classes={{
                  ...selectClasses,
                }}
                name={item.name}
                onChange={handleOnChange}
                options={item.options}
                value={rowData[item.name]}
                childHasError={(bool) => setRowHasError(bool)}
                error={item.error}
                selectMessage={item.selectMessage}
                validation={item.validation}
              />
            ) : (
              <Input
                columnDataArr={(allRowsData || []).map(
                  (obj) => obj.rowData[item.name]
                )}
                tableName={tableName}
                classes={{ ...inputClasses }}
                type={item.type}
                name={item.name}
                onChange={handleOnChange}
                value={rowData[item.name]}
                item={item.name}
                childHasError={(bool) => setRowHasError(bool)}
                error={item.error}
                validation={item.validation}
              />
            )}
          </TableCell>
        );
      })}
      <TableCell
        className={classNames(
          classes.tableBodyCell,
          `tableBodyCell_${tableName}`
        )}
      >
        <Button
          className={classNames(classes.saveBtn, `saveBtn${tableName}`)}
          disabled={rowHasError}
          type="button"
          onClick={handleSave}
        >
          Save
        </Button>

        <Button
          className={classNames(classes.cancelBtn, `cancelBtn${tableName}`)}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </TableCell>
    </TableRow>
  );
};

const Row = ({
  data,
  handleEditRow,
  classes,
  tableName,
  handleDeleteRow,
  isAdding,
  isEditing,
}) => {
  return (
    <TableRow
      className={classNames(classes.tableBodyRow, `tableBodyRow_${tableName}`)}
    >
      {Object.keys(data).map((key) => {
        return (
          <TableCell
            className={classNames(
              classes.tableBodyCell,
              `tableBodyCell_${tableName}`
            )}
          >
            {data[key]}
          </TableCell>
        );
      })}
      <TableCell
        className={classNames(
          classes.tableBodyCell,
          `tableBodyCell_${tableName}`
        )}
      >
        <Button
          disabled={isAdding || isEditing}
          className={classNames(classes.editBtn, `editBtn_${tableName}`)}
          onClick={handleEditRow}
        >
          Edit
        </Button>

        <Button
          disabled={isAdding || isEditing}
          className={classNames(classes.deleteBtn, `deleteBtn_${tableName}`)}
          onClick={handleDeleteRow}
        >
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
};

const DataTable = (props) => {
  const [allRowsData, setAllRowsData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  useEffect(() => {
    setAllRowsData(
      (props.defaultData || []).map((item) => ({
        isEditing: false,
        rowData: item,
      }))
    );
  }, [props.defaultData]);
  useEffect(() => {
    const formatedData = allRowsData.map(({ rowData }, i) => rowData);
    props.getData(formatedData);
  }, [props.getData, allRowsData]);
  const handleSave = (row) => {
    let action = null
    if (row.uuid_id.length==0){
        action = postNewEntry  
    }
    else if(row.uuid_id.length==36){
        action = updateEntry    
    }
    else{return;}
    action(row).then((successfulResponse) => {
      if (!successfulResponse) {
        return;
      }
      if (isEditing) {
        const arr = allRowsData.map((item, i) => {
          if (i === editingIndex) {
            return {
              isEditing: false,
              rowData: row,
            };
          } else return item;
        });
        setAllRowsData(arr);
        setEditingIndex(null);
        setIsEditing(false);
      } else {
        setAllRowsData([...allRowsData, { isEditing: false, rowData: row }]);
        setIsAdding(false);
      }
    });
  };
  const handleCancel = (index) => {
    if (isEditing) {
      const arr = allRowsData.map((item, i) => {
        if (i === index) {
          return {
            isEditing: false,
            rowData: item.rowData,
          };
        } else return item;
      });
      setAllRowsData(arr);
      setEditingIndex(null);
      setIsEditing(false);
    } else {
      setIsAdding(false);
    }
  };


  const handleDeleteRow = (index) => {
    const current_row = allRowsData.filter((item, i) => i === index);
    deleteEntry(current_row[0].rowData).then((isDeleted) => {
        if (!isDeleted){
        console.log(isDeleted.data)
        return;
    }
    });
    const arr = allRowsData.filter((item, i) => i !== index);
    setAllRowsData(arr);
  };
  const handleEditRow = (index) => {
    const arr = allRowsData.map((item, i) => {
      if (i === index) {
        return {
          isEditing: true,
          rowData: item.rowData,
        };
      } else return item;
    });
    setAllRowsData(arr);
    setEditingIndex(index);
    setIsEditing(true);
  };
  const {
    fieldsArr = [],
    classes = {},
    tableName,
    addRowBtnText,
    initWithoutHead,
  } = props;

  let headRow = [
    ...fieldsArr.map((item) => ({ label: item.label, name: item.name })),
    { label: "Actions", name: "actions" },
  ];
  const showHeader =
    initWithoutHead && !allRowsData.length && !isAdding ? false : true;
  return (
    <>
      <Table className={classNames(classes.table, `table_${tableName}`)}>
        {showHeader && (
          <TableHead className={classNames(classes.tableHead)}>
            <TableRow
              className={classNames(
                classes.tableHeadRow,
                `tableHeadRow_${tableName}`
              )}
            >
              {headRow.map(({ label, name }, i) => (
                <TableCell
                  className={classNames(
                    classes.tableHeadCell,
                    classes[`tableHeadCell${name}`],
                    `tableHeadCell_${tableName} tableHeadCell_${name}`
                  )}
                  key={i}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        )}
        <TableBody
          className={classNames(classes.tableBody, `tableBody_${tableName}`)}
        >
          {!!allRowsData.length &&
            allRowsData.map(({ isEditing, rowData }, i) => {
              return isEditing ? (
                <EditableRow
                  tableName={tableName}
                  isEditing={isEditing}
                  editingIndex={editingIndex}
                  selectClasses={{
                    selectFormControl: classes.selectFormControl,
                    selectInputLabel: classes.selectInputLabel,
                    select: classes.select,
                    selectMenuItem: classes.selectMenuItem,
                  }}
                  inputClasses={{
                    inputWrapperDiv: classes.inputWrapperDiv,
                    input: classes.input,
                    error: classes.error,
                  }}
                  classes={{
                    tableBodyRow: classes.tableBodyRow,
                    tableBodyCell: classes.tableBodyCell,
                    tableCellRow: classes.tableCellRow,
                    saveBtn: classes.saveBtn,
                    cancelBtn: classes.cancelBtn,
                  }}
                  allRowsData={allRowsData}
                  editData={rowData}
                  handleSave={handleSave}
                  handleCancel={handleCancel}
                  fieldsArr={fieldsArr}
                />
              ) : (
                <Row
                  key={i}
                  tableName={tableName}
                  classes={{
                    tableBodyRow: classes.tableBodyRow,
                    tableBodyCell: classes.tableBodyCell,
                    tableCellRow: classes.tableCellRow,
                    editBtn: classes.editBtn,
                    deleteBtn: classes.deleteBtn,
                  }}
                  isAdding={isAdding}
                  isEditing={isEditing}
                  handleEditRow={() => handleEditRow(i)}
                  handleDeleteRow={() => handleDeleteRow(i)}
                  data={rowData}
                />
              );
            })}
          {isAdding && (
            <EditableRow
              tableName={tableName}
              allRowsData={allRowsData}
              selectClasses={{
                selectFormControl: classes.selectFormControl,
                selectInputLabel: classes.selectInputLabel,
                select: classes.select,
                selectMenuItem: classes.selectMenuItem,
              }}
              inputClasses={{
                inputWrapperDiv: classes.inputWrapperDiv,
                input: classes.input,
                error: classes.error,
              }}
              classes={{
                tableBodyRow: classes.tableBodyRow,
                tableBodyCell: classes.tableBodyCell,
                saveBtn: classes.saveBtn,
                cancelBtn: classes.cancelBtn,
                tableCellRow: classes.tableCellRow,
              }}
              handleSave={handleSave}
              handleCancel={handleCancel}
              fieldsArr={fieldsArr}
            />
          )}
        </TableBody>
      </Table>
      <div>
        <Button
          className={classNames(classes.addBtn, `addBtn_${tableName}`)}
          disabled={isAdding || isEditing}
          onClick={() => setIsAdding(true)}
        >
          {addRowBtnText || "Add new address"}
        </Button>
      </div>
    </>
  );
};

const styles = () => ({
  table: {},
  tableHead: {},
  tableHeadRow: {},
  tableHeadCell: {},
  tableBody: {},
  tableBodyRow: {},
  tableBodyCell: {},
  inputWrapperDiv: {},
  input: {},
  error: {},
  selectFormControl: {},
  selectInputLabel: {},
  select: {},
  selectMenuItem: {},
  saveBtn: {},
  cancelBtn: {},
  addBtn: {},
  deleteBtn: {},
  editBtn: {},
});

export default DataTable;
