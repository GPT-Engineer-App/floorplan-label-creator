import React, { useState } from "react";
import {
  Container,
  VStack,
  Text,
  Input,
  Button,
  Box,
  Image,
  HStack,
} from "@chakra-ui/react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const Index = () => {
  const [image, setImage] = useState(null);
  const [labels, setLabels] = useState([]);
  const [newLabel, setNewLabel] = useState("");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddLabel = () => {
    if (newLabel.trim() !== "") {
      setLabels([...labels, { id: `label-${labels.length}`, text: newLabel }]);
      setNewLabel("");
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const updatedLabels = Array.from(labels);
    const [movedLabel] = updatedLabels.splice(result.source.index, 1);
    updatedLabels.splice(result.destination.index, 0, movedLabel);
    setLabels(updatedLabels);
  };

  return (
    <Container
      centerContent
      maxW="container.md"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">Upload Floor Plan</Text>
        <Input type="file" accept="image/*" onChange={handleImageUpload} />
        {image && (
          <Box position="relative" width="100%" height="auto">
            <Image src={image} alt="Floor Plan" width="100%" />
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="labels" direction="vertical">
                {(provided) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    position="absolute"
                    top="0"
                    left="0"
                    width="100%"
                    height="100%"
                  >
                    {labels.map((label, index) => (
                      <Draggable
                        key={label.id}
                        draggableId={label.id}
                        index={index}
                      >
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            position="absolute"
                            top={`${index * 30}px`}
                            left="10px"
                            bg="black"
                            color="white"
                            p={2}
                            borderRadius="md"
                          >
                            {label.text}
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </DragDropContext>
          </Box>
        )}
        <HStack spacing={2} width="100%">
          <Input
            placeholder="Enter label"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
          />
          <Button onClick={handleAddLabel}>Add Label</Button>
        </HStack>
      </VStack>
    </Container>
  );
};

export default Index;