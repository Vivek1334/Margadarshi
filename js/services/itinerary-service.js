// Itinerary State, Export, Custom Editing, and Storage Service

class ItineraryService {
  constructor() {
    this.currentItinerary = this.loadSavedItinerary() || null;
    this.checkedActivities = this.loadCheckedActivities() || {};
  }

  loadSavedItinerary() {
    try {
      const saved = localStorage.getItem("voyage_active_itinerary");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  loadCheckedActivities() {
    try {
      const saved = localStorage.getItem("voyage_checked_activities");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }

  saveItinerary(itinerary) {
    this.currentItinerary = itinerary;
    this.checkedActivities = {};
    localStorage.setItem("voyage_active_itinerary", JSON.stringify(itinerary));
    localStorage.removeItem("voyage_checked_activities");
    window.dispatchEvent(new CustomEvent("voyage:itinerary-updated", { detail: itinerary }));
  }

  getCurrentItinerary() {
    return this.currentItinerary;
  }

  toggleActivityCheck(dayNum, slot) {
    const key = `d${dayNum}_${slot}`;
    this.checkedActivities[key] = !this.checkedActivities[key];
    localStorage.setItem("voyage_checked_activities", JSON.stringify(this.checkedActivities));
    return this.checkedActivities[key];
  }

  isActivityChecked(dayNum, slot) {
    return !!this.checkedActivities[`d${dayNum}_${slot}`];
  }

  /**
   * Edit an existing activity slot
   */
  updateActivity(dayNum, slotKey, title, description, cost, tag) {
    if (!this.currentItinerary) return;
    const day = this.currentItinerary.days.find(d => d.dayNumber === parseInt(dayNum));
    if (day && day[slotKey]) {
      day[slotKey].title = title;
      day[slotKey].description = description;
      if (cost) day[slotKey].cost = cost;
      if (tag) day[slotKey].tag = tag;
      this.saveItinerary(this.currentItinerary);
    }
  }

  /**
   * Reset or delete an activity from a slot
   */
  deleteActivity(dayNum, slotKey) {
    if (!this.currentItinerary) return;
    const day = this.currentItinerary.days.find(d => d.dayNumber === parseInt(dayNum));
    if (day && day[slotKey]) {
      day[slotKey] = {
        time: day[slotKey].time || "Custom",
        title: "Free Time / Leisure",
        description: "Relax, explore at your own pace, or discover unexpected neighborhood spots.",
        tag: "Relaxation",
        cost: "Free"
      };
      this.saveItinerary(this.currentItinerary);
    }
  }

  /**
   * Add a custom item or override slot
   */
  setCustomActivity(dayNum, slotKey, title, description, time, cost, tag) {
    if (!this.currentItinerary) return;
    const day = this.currentItinerary.days.find(d => d.dayNumber === parseInt(dayNum));
    if (day) {
      day[slotKey] = {
        time: time || (slotKey === "morning" ? "09:30 AM" : slotKey === "afternoon" ? "02:00 PM" : "07:00 PM"),
        title,
        description,
        cost: cost || "$$",
        tag: tag || "Custom Adventure"
      };
      this.saveItinerary(this.currentItinerary);
    }
  }

  exportAsJson() {
    if (!this.currentItinerary) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.currentItinerary, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    const safeTitle = (this.currentItinerary.tripTitle || "itinerary").toLowerCase().replace(/[^a-z0-9]/g, "-");
    downloadAnchor.setAttribute("download", `${safeTitle}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  copyAsMarkdown() {
    if (!this.currentItinerary) return Promise.reject("No itinerary");
    const it = this.currentItinerary;

    let md = `# ${it.tripTitle}\n`;
    md += `**Destination**: ${it.destination} | **Duration**: ${it.totalDays} Days | **Style**: ${it.travelStyle}\n`;
    md += `**Estimated Budget**: ${it.estimatedBudgetUSD}\n\n`;
    md += `> ${it.overview}\n\n`;

    it.days.forEach((d) => {
      md += `## Day ${d.dayNumber}: ${d.title}\n\n`;
      if (d.morning) md += `* **Morning (${d.morning.time})**: ${d.morning.title} - ${d.morning.description}\n`;
      if (d.afternoon) md += `* **Afternoon (${d.afternoon.time})**: ${d.afternoon.title} - ${d.afternoon.description}\n`;
      if (d.evening) md += `* **Evening (${d.evening.time})**: ${d.evening.title} - ${d.evening.description}\n`;
      md += `* **Food Highlight**: ${d.foodHighlight}\n`;
      md += `* **Insider Tip**: ${d.insiderTip}\n\n`;
    });

    if (it.packingEssentials && it.packingEssentials.length > 0) {
      md += `### Packing Essentials\n`;
      it.packingEssentials.forEach((item) => {
        md += `- [ ] ${item}\n`;
      });
    }

    return navigator.clipboard.writeText(md);
  }

  triggerPrint() {
    window.print();
  }
}

export const itineraryService = new ItineraryService();
