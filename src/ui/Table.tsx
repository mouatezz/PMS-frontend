import { createContext, useContext } from "react";
import styled from "styled-components";

export const StyledTable = styled.div`
  border: 1px solid var(--color-grey-200);

  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
`;

export const CommonRow = styled.header`
  display: grid;
  grid-template-columns: ${(props: any) => props.columns};
  column-gap: 2.4rem;
  align-items: center;
  transition: none;

  @media only screen and (max-width: 500px) {
    grid-template-columns: 0.6fr 1fr 1.4fr 0.4fr;
  }
`;

export const StyledHeader: any = styled(CommonRow)`
  padding: 1.6rem 2.4rem;

  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
`;

export const StyledBody = styled.section`
  margin: 0.4rem 0;
`;

export const StyledRow: any = styled(CommonRow)`
  padding: 1.2rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

export const Footer = styled.footer`
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  padding: 1.2rem;

  &:not(:has(*)) {
    display: none;
  }

  @media only screen and (max-width: 500px) {
    flex-direction: column;
  }
`;

export const Empty = styled.p`
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  margin: 2.4rem;
`;

const TableContext = createContext({});
function Table({ columns, children }: any) {
  return (
    <TableContext.Provider value={{ columns }}>
      <StyledTable role="table">{children}</StyledTable>
    </TableContext.Provider>
  );
}

function Header({ children }: any) {
  const { columns }: any = useContext(TableContext);

  return (
    <StyledHeader role="row" columns={columns} as={"header"}>
      {children}
    </StyledHeader>
  );
}

function Body({ data, render }: any) {
  if (!data.length) return <Empty>No data to display at the moment</Empty>;
  return data.map(render);
}

function Row({ children }: { children: any; role?: string }) {
  const { columns }: any = useContext(TableContext);
  return <StyledRow columns={columns}>{children}</StyledRow>;
}

Table.Header = Header;
Table.Row = Row;
Table.Body = Body;
Table.Footer = Footer;

export default Table;
