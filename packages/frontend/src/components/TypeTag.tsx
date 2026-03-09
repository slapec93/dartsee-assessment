import stringToColor from "../utils/stringToColor";

type Props = {
  type: string;
}

const TypeTag = ({ type }: Props) => {
  const color = stringToColor(type);
  const backgroundColor = stringToColor(type, 90);
  return (
    <span className='border-1 rounded-md px-2 mt-2' style={{ color, backgroundColor, borderColor: color }}>{type}</span>
  );
}

export default TypeTag;
