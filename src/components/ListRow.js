import React from 'react';

const ListRow = ({ date, events }) => {
  return (
    <>
      {events.map(({ Date, Title, Link, Duration, Location }, i) => (
        <tr key={i}>
          {i === 0 ? <td rowSpan={events.length}>{Date}</td> : null}
          <td>
            <a href={Link}>{Title}</a>
          </td>
          <td>{Location}</td>
          <td>{Duration}</td>
        </tr>
      ))}
    </>
  );
};

export default ListRow;
