import React from 'react';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableRowProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className={`table-container ${className}`}>
      <table>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return <thead>{children}</thead>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children, onClick, className = '' }: TableRowProps) {
  return (
    <tr onClick={onClick} className={className}>
      {children}
    </tr>
  );
}

export function TableHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <th className={className}>{children}</th>;
}

export function TableCell({ children, className = '', style = {} }: TableCellProps) {
  return <td className={className} style={style}>{children}</td>;
}

export default Table;
