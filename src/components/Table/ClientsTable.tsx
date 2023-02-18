import { Checkbox } from "@mantine/core";
import { useRouter } from "next/router";
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
  overflow: "scroll",
});

const ClientsTable = ({ data }: { data: PrismaDataClient[] }) => {
  console.log("CLIENTS", data);
  const router = useRouter();

  const headers = [
    {
      name: "Client Name",
      key: "name",
      width: "200px",
    },
    {
      name: "Mobile",
      key: "mobile",
      width: "100px",
    },
    {
      name: "Email",
      key: "email",
      width: "250px",
    },
    {
      name: "Last Order",
      key: "order",
      width: "300px",
    },
    {
      name: "Address",
      key: "address",
      width: "300px",
    },
    {
      name: "Actions",
      key: "actions",
      width: "200px",
    },
  ];

  return (
    <Wrapper>
      <TableWrapper>
        <TableHead>
          <TableRow>
            {headers.map((header, index) => {
              return (
                <TableHeadItem
                  key={header.key}
                  style={{
                    width: header.width,
                    position: index === 0 ? "sticky" : "static",
                  }}
                >
                  {header.name}
                </TableHeadItem>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((client) => {
            const updatedClient = {
              ...client,
              mobile: Number(client.mobile),
              actions: "actions",
            };

            return (
              <TableRow
                key={client.id}
                onClick={() => router.push(`clients/${client.id}`)}
                style={{ cursor: "pointer" }}
              >
                {headers.map((header) => {
                  if (Object.keys(updatedClient).includes(header.key)) {
                    return (
                      <TableItem
                        style={{ width: header.width }}
                        key={header.key}
                      >
                        {/* @ts-ignore */}
                        {updatedClient[header.key]}
                      </TableItem>
                    );
                  } else {
                    return (
                      <TableItem
                        style={{ width: header.width }}
                        key={header.key}
                      >
                        {"-"}
                      </TableItem>
                    );
                  }
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </TableWrapper>
    </Wrapper>
  );
};

export default ClientsTable;
