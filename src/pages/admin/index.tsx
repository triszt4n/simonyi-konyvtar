import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/core"
import React from "react"

export default function AdminIndex() {
  return (
    <Tabs>
      <TabList>
        <Tab>Kölcsönzések</Tab>
        <Tab>Konyvek</Tab>
        <Tab>Felhasznalok</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>help</TabPanel>
        <TabPanel>me</TabPanel>
        <TabPanel>please</TabPanel>
      </TabPanels>
    </Tabs>
  )
}
