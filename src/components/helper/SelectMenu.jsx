import React from 'react'
import { Portal, Select, createListCollection } from "@chakra-ui/react"
const SelectMenu = (
    {collection, handeChange, label, placeholder,value}
) => {
  return (
    <Select.Root
    
    value={value}
    onValueChange ={handeChange}
    collection={collection} size="sm" >
          <Select.HiddenSelect />
          <Select.Label color="blue" style={{fontStyle: "italic"}}>{label}</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText color="blue.500" placeholder={placeholder} />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner> 
              <Select.Content>
                {collection.items.map((item) => (
                  <Select.Item color="blue.500" item={item} key={item.value}>
                    {item.label}
    
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
  )
}

export default SelectMenu