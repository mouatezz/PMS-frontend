import { useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";

const StyledFilter = styled.div`
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
`;

const FilterButton: any = styled.button`
  background-color: var(--color-grey-0);
  border: none;

  ${(props: any) =>
    props.active &&
    css`
      background-color: var(--color-brand-600);
      color: var(--color-brand-50);
    `}

  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;
  /* To give the same height as select */
  padding: 0.44rem 0.8rem;
  transition: all 0.3s;

  @media only screen and (max-width: 500px) {
    font-size: 1.2rem;
  }

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

const Filter = ({ filterField, options }: any) => {
  const [searchParams, setSearchParams]: any = useSearchParams();

  const currentFilter = searchParams.get(filterField) || options.at(0).value;

  const handleClick = (value: string) => {
    searchParams.set("page", 1);
    searchParams.set(filterField, value);
    setSearchParams(searchParams);
  };
  return (
    <StyledFilter>
      {options.map((option: { value: string; label: string }) => (
        <FilterButton
          key={option.value}
          onClick={() => handleClick(option.value)}
          active={currentFilter === option.value}
          disabled={currentFilter === option.value}
        >
          {option.label}
        </FilterButton>
      ))}
    </StyledFilter>
  );
};

export default Filter;
