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
        const link = event && event.Link ? event.Link : null;

        return (
          <td key={i}>{link === null ? title : <a href={link}>{title}</a>}</td>
        );
      })}
    </tr>
  );
};

export default Block;
