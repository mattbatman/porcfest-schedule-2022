import React from 'react';
import { find } from 'ramda';

const Block = ({ data, allLocations }) => {
  const { date, events } = data;
  return (
    <tr>
      <td>{date}</td>
      {allLocations.map((d, i) => {
        const event = find((e) => e.Location === d)(events);
        const title = event && event.Title ? event.Title : '';
        return <td key={i}>{title}</td>;
      })}
    </tr>
  );
};

export default Block;
