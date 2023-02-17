import { styled } from "stitches.config";
import { PrismaDataClient } from "~/types/stocks";
import {
  TableItem,
  TableRow,
  TableHead,
  TableBody,
  TableWrapper,
  TableHeadItem,
} from "./elements";

const Wrapper = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "flex-start",
});

const ClientsTable = ({ data }: { data: PrismaDataClient[] }) => {
  return (
    <Wrapper>
      <TableWrapper>
        <TableHead>
          <TableRow>
            <TableHeadItem>Client</TableHeadItem>
            <TableHeadItem>Mobile</TableHeadItem>
            <TableHeadItem>Email</TableHeadItem>
            <TableHeadItem>Address</TableHeadItem>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((client) => (
            <TableRow key={client.id}>
              <TableItem>{client.name}</TableItem>
              <TableItem>{Number(client?.mobile)}</TableItem>
              <TableItem>{client?.email}</TableItem>
              <TableItem>{client.address}</TableItem>
            </TableRow>
          ))}
        </TableBody>
      </TableWrapper>
    </Wrapper>
  );
};

export default ClientsTable;
