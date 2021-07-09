import {
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core";
import { useState } from "react";
import { ITodoTagsFilter, tags } from "./TodoItemsContext";


const useTodoItemListStyles = makeStyles({
  formControl: {
    minWidth: 120,
    marginTop: 20,
  },
});

export const TodoTagsFilter: React.FC<ITodoTagsFilter> = function ({
  handleFilter,
}) {
  const [tagname, setTagName] = useState("0");

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTagName(event.target.value as string);
    handleFilter(event.target.value as string);
  };


  const classes = useTodoItemListStyles();
  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={tagname}
        onChange={handleChange}
      >
        {tags
          ? tags.map((tag) => (
              <MenuItem value={tag.id} key={tag.id}>
                {tag.name}
              </MenuItem>
            ))
          : null}
      </Select>
    </FormControl>
  );
};
