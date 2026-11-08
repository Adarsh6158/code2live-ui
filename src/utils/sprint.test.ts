import assert from "node:assert";
import {
  getSprintForDate,
  formatSprintDateRange,
  DEFAULT_SPRINT_CONFIG,
} from "./sprint.ts";

function runTests() {
  const config = {
    kickoffDate: "2025-04-09",
    sprintDurationDays: 14,
    initialSprintNumber: 1,
  };

  {
    const s1Day1 = getSprintForDate("2025-04-09", config, "2025-04-09");
    assert.strictEqual(s1Day1.sprintNumber, 1);
    assert.strictEqual(s1Day1.formattedDateRange, "Apr 9 – 22");
    assert.strictEqual(s1Day1.status, "Current");
    assert.strictEqual(s1Day1.startDate.getDate(), 9);
    assert.strictEqual(s1Day1.endDate.getDate(), 22);
  }

  {
    const s1Day14 = getSprintForDate("2025-04-22", config, "2025-04-22");
    assert.strictEqual(s1Day14.sprintNumber, 1);
    assert.strictEqual(s1Day14.formattedDateRange, "Apr 9 – 22");
    assert.strictEqual(s1Day14.status, "Current");
  }

  {
    const s2Day1 = getSprintForDate("2025-04-23", config, "2025-04-23");
    assert.strictEqual(s2Day1.sprintNumber, 2);
    assert.strictEqual(s2Day1.formattedDateRange, "Apr 23 – May 6");
    assert.strictEqual(s2Day1.status, "Current");
  }

  {
    const s43 = getSprintForDate("2026-11-18", config, "2026-11-18");
    assert.strictEqual(s43.sprintNumber, 43);
    assert.strictEqual(s43.formattedDateRange, "Nov 18 – Dec 1");
    assert.strictEqual(s43.status, "Current");
  }

  {
    const s46 = getSprintForDate("2026-12-30", config, "2026-12-30");
    assert.strictEqual(s46.sprintNumber, 46);
    assert.strictEqual(s46.formattedDateRange, "Dec 30 – Jan 12");
    assert.strictEqual(s46.status, "Current");
  }

  {
    const sLeap = getSprintForDate("2028-02-23", config, "2028-02-23");
    assert.strictEqual(sLeap.sprintNumber, 76);
    assert.strictEqual(sLeap.formattedDateRange, "Feb 23 – Mar 7");
    assert.strictEqual(sLeap.status, "Current");
  }

  {
    const historical = getSprintForDate("2025-05-10", config, "2026-11-08");
    assert.strictEqual(historical.sprintNumber, 3);
    assert.strictEqual(historical.status, "Completed");
  }

  {
    const future = getSprintForDate("2027-04-15", config, "2026-11-08");
    assert.strictEqual(future.sprintNumber, 53);
    assert.strictEqual(future.status, "Upcoming");
  }

  {
    const current = getSprintForDate("2026-11-08", config, "2026-11-08");
    assert.strictEqual(current.sprintNumber, 42);
    assert.strictEqual(current.formattedDateRange, "Nov 4 – 17");
    assert.strictEqual(current.status, "Current");
  }

  {
    for (let i = 1; i <= 30; i++) {
      const targetDate = new Date(2025, 3, 9 + (i - 1) * 14 + 2);
      const sprintA = getSprintForDate(targetDate, config);
      const nextDate = new Date(2025, 3, 9 + i * 14 + 2);
      const sprintB = getSprintForDate(nextDate, config);

      assert.strictEqual(sprintB.sprintNumber, sprintA.sprintNumber + 1);

      const nextDayAfterEnd = new Date(sprintA.endDate);
      nextDayAfterEnd.setDate(nextDayAfterEnd.getDate() + 1);
      assert.strictEqual(
        nextDayAfterEnd.toDateString(),
        sprintB.startDate.toDateString()
      );
    }
  }

  {
    const preKickoff = getSprintForDate("2025-01-01", config, "2025-01-01");
    assert.strictEqual(preKickoff.sprintNumber, 1);
    assert.strictEqual(preKickoff.status, "Upcoming");
    assert.strictEqual(preKickoff.formattedDateRange, "Apr 9 – 22");
  }

  {
    const rangeSameMonth = formatSprintDateRange(
      new Date(2026, 10, 4),
      new Date(2026, 10, 17)
    );
    assert.strictEqual(rangeSameMonth, "Nov 4 – 17");

    const rangeCrossMonth = formatSprintDateRange(
      new Date(2026, 10, 18),
      new Date(2026, 11, 1)
    );
    assert.strictEqual(rangeCrossMonth, "Nov 18 – Dec 1");
  }

  console.log("All sprint tests passed successfully.");
}

runTests();
