import { Checkbox } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { styled } from "stitches.config";
import { useAppSelector } from "~/store";
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

interface ClientTableData {
  name: string;
  mobile: string;
  email: string;
  order: string;
  address: string[];
}

interface Headers {
  name: string;
  key: "name" | "mobile" | "email" | "order" | "address";
  width: string;
}

const ClientsTable = ({ data }: { data: PrismaDataClient[] }) => {
  const [formattedData, setFormattedData] = useState<PrismaDataClient[]>([]);
  console.log("CLIENTS", data);
  const search = useAppSelector((state) => state.search);
  const router = useRouter();

  const headers: Headers[] = [
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
  ];

  useEffect(() => {
    const filteredData = data.filter((client) => {
      return client.name.toLowerCase().includes(search.toLowerCase());
    });
    setFormattedData(filteredData);
  }, [data, search]);

  const getClientLastOrder = (client: PrismaDataClient) => {
    if (client.order && client.order.length > 0) {
      // sort by date
      const sortedOrders = client.order.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      if (sortedOrders[0]?.orderId) {
        return sortedOrders[0]?.orderId;
      } else {
        return "-";
      }
    } else {
      return "-";
    }
  };

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
          {formattedData.map((client) => {
            const updatedClient = {
              ...client,
              actions: "actions",
            };

            return (
              <TableRow
                key={client.id}
                onClick={() => router.push(`clients/${client.id}`)}
                style={{ cursor: "pointer" }}
              >
                {headers.map((header) => {
                  if (header.key === "order") {
                    return (
                      <TableItem
                        style={{ width: header.width }}
                        key={header.key}
                      >
                        {getClientLastOrder(client)}
                      </TableItem>
                    );
                  }

                  if (header.key === "address") {
                    return (
                      <TableItem
                        style={{ width: header.width }}
                        key={header.key}
                      >
                        {client.address.map((address, index) => {
                          return (
                            <p key={index} style={{ marginRight: "14px" }}>
                              {index + 1}
                              {". "}
                              {address}
                            </p>
                          );
                        })}
                      </TableItem>
                    );
                  }

                  if (Object.keys(updatedClient).includes(header.key)) {
                    return (
                      <TableItem
                        style={{ width: header.width }}
                        key={header.key}
                      >
                        {updatedClient[header.key]
                          ? updatedClient[header.key]
                          : "-"}
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
