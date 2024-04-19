import { Modal, Button } from "antd";

interface GroupModalProps {
  currentGroup: string;
  onSelectGroup: (groupId: string) => void;
  onClose: () => void;
  visible: boolean;
  groupNames: string[];
}

const groups = ["1", "2", "3", "4"];
export default function GroupModal({
  currentGroup,
  onSelectGroup,
  onClose,
  visible,
  groupNames,
}: GroupModalProps) {
  return (
    <Modal
      title="Select a group"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      {groups
        .filter((groupId) => groupId !== currentGroup)
        .map((groupId) => (
          <Button
            key={groupId}
            onClick={() => onSelectGroup(groupId)}
            style={{ margin: "10px" }}
          >
            {groupNames[Number(groupId) -1] || groups[Number(groupId)]}
          </Button>
        ))}
    </Modal>
  );
}
