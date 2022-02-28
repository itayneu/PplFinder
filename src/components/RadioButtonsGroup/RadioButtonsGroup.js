import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import * as S from "./style";

const RadioButtonsGroup = ({ onChange, value, radioButtons }) => {
  const handleChange = (event) => {
    onChange && onChange(event.target.value);
  };
  return (
    <S.RadioButtonsGroup>
      <FormControl>
        <RadioGroup
          row
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          defaultValue={value}
          onChange={handleChange}
        >
          {radioButtons.map((button) => {
          return (
            <FormControlLabel value={button.value} control={<Radio color="primary" />} label={button.label} />
          );
        })}
        </RadioGroup>
      </FormControl>
    </S.RadioButtonsGroup>
  );
};

export default RadioButtonsGroup;
