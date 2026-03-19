import { TreeView, TreeItem } from '@mui/lab';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface EmployeeNode {
  id: number;
  firstName: string;
  lastName: string;
  subordinates: EmployeeNode[];
}

interface OrgChartProps {
  data: EmployeeNode[];
}

export default function OrgChart({ data }: OrgChartProps) {
  const renderNode = (node: EmployeeNode) => (
    <TreeItem key={node.id} nodeId={node.id.toString()} label={`${node.firstName} ${node.lastName}`}>
      {node.subordinates.map(sub => renderNode(sub))}
    </TreeItem>
  );

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      {data.map(node => renderNode(node))}
    </TreeView>
  );
}