import React from 'react';

const Events = ({ events }) => {
  return (
    <>
      {events.map(({ Title, Location, Link }) => (
        <p key={`${Title}-${Location}`}>
          <a href={Link}>{Title}</a> | {Location}
        </p>
      ))}
    </>
  );
};

const ListRow = ({ date, events }) => {
  return (
    <tr>
      <td>{date}</td>
      <td>
        <Events events={events} />
      </td>
    </tr>
  );
};

export default ListRow;
