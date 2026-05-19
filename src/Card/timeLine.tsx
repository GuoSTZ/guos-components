import React from 'react';
import foodIcon from './food.svg';
import defaultIcon from './default.svg';
import './timeLine.less';

export type TimeLineItem = {
  id?: React.Key;
  time: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
};

export type TimeLineProps = {
  items?: TimeLineItem[];
};

const defaultItems: TimeLineItem[] = [
  {
    time: '2026-05-08 09:00:00',
    content: (
      <div>
        <div>
          <div>账单名称</div>
          <div>100</div>
        </div>
        <div>
          <div>用户A 200</div>
          <div>用户B 200</div>
          <div>用户C 200</div>
          <div>用户D 200</div>
        </div>
      </div>
    ),
  },
  {
    time: '2026-05-08 14:30:15',
    content: (
      <div>
        <div>账单名称</div>
      </div>
    ),
    icon: <img src={foodIcon} width={16} />,
  },
  {
    time: '2026-05-08 18:45:36',
    content: (
      <div>
        <div>账单名称</div>
      </div>
    ),
  },
];

const TimeLine = ({ items = defaultItems }: TimeLineProps) => {
  return (
    <section className="timeline-card">
      <ol className="timeline-card__list">
        {items.map((item, index) => {
          return (
            <li
              key={item.id ?? `${item.time}-${index}`}
              className="timeline-card__item"
            >
              <div style={{ height: 22 }}>
                <span aria-hidden="true" className={`timeline-card__dot`}>
                  {item.icon ?? <img src={defaultIcon} width={16} />}
                </span>
                <span className="timeline-card__time">{item.time}</span>
              </div>

              <div className="timeline-card__content">
                <div className="timeline-card__body">{item.content}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default TimeLine;
