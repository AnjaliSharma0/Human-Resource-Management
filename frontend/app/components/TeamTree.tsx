import { List, ListItem, ListItemText } from "@mui/material";

export interface TeamNode {
  id: number;
  firstName: string;
  lastName: string;
  subordinates: TeamNode[];
}

interface Props {
  node: TeamNode;
}

export default function TeamTree({ node }: Props) {
  return (
    <List className="ml-6">
      <ListItem>
        <ListItemText primary={`${node.firstName} ${node.lastName}`} />
      </ListItem>
      {node.subordinates?.map(sub => (
        <TeamTree key={sub.id} node={sub} />
      ))}
    </List>
  );
}