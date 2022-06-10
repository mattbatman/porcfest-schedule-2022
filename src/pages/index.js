import React from 'react';
import { findIndex } from 'ramda';
import { Link } from 'gatsby';
import scheduleData from '../data/schedule.json';
import ListRow from '../components/ListRow';

const data = scheduleData.reduce((acc, cv) => {
  const { Date } = cv;
  const eventIndex = findIndex(
    (existingGroup) => existingGroup.date === Date,
    acc
  );

  if (eventIndex < 0) {
    const events = [];
    events.push(cv);

    acc.push({
      date: Date,
      events
    });

    return acc;
  }

  acc[eventIndex].events.push(cv);

  return acc;
}, []);

console.log(data);

const IndexPage = () => {
  return (
    <main className="list-page">
      <title>PorcFest Schedule 2022</title>
      <h1>PorcFest Schedule 2022</h1>
      <p>
        This is an attempt to replicate the events from the main{' '}
        <a href="https://porcfest.com/schedule/">PorcFest schedule</a>.
      </p>
      <p>
        <Link to="/grid">Grid View</Link>
      </p>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Event</th>
            <th>Location</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <ListRow key={d.date} date={d.date} events={d.events} />
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default IndexPage;
