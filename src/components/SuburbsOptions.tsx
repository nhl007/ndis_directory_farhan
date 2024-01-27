import { generateSelectDefault } from "@/utils/utils";
import Select, { Props as SelectProps } from "react-select";
import { FixedSizeList as List } from "react-window";
import { useDebouncedCallback } from "use-debounce";

interface SuburbsOptions {
  suburbsOptions: {
    label: string;
    value: string;
  }[];
  suburbs: string[];
  setSuburbs: React.Dispatch<React.SetStateAction<string[]>>;
}

const LargeDropdown: React.FC<SuburbsOptions & SelectProps> = ({
  suburbsOptions,
  setSuburbs,
  suburbs,
  isDisabled,
}) => {
  const handleChange = (selectedOption: any) => {
    const data = selectedOption.map((d: any) => d.value);
    setSuburbs(data);
  };

  const debouncedHandleChange = useDebouncedCallback(
    (selectedOption: any) => handleChange(selectedOption),
    500
  );

  // @ts-ignore
  const MenuList = ({ options, children, maxHeight, getValue }) => {
    const [value] = getValue();
    const initialOffset = options.indexOf(value) * 35;

    return (
      <List
        height={maxHeight ?? "35"}
        itemCount={children.length}
        itemSize={35}
        width="100%"
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    );
  };
  return (
    <Select
      isDisabled={isDisabled}
      id="suburbs_options"
      instanceId="suburbs_options"
      isMulti
      options={suburbsOptions}
      components={{ MenuList }}
      isSearchable
      onChange={debouncedHandleChange}
      value={generateSelectDefault(suburbs)}
      placeholder="Select Suburbs"
    />
  );
};

export default LargeDropdown;
