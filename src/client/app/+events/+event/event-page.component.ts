import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  faArrowCircleLeft,
  faArrowCircleRight,
  faArrowCircleUp,
  faCodeBranch,
  faPowerOff,
  faSave,
  faTruckLoading,
  faWrench,
} from '@fortawesome/free-solid-svg-icons';
import { cloneDeep, isEqual } from 'lodash';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { EventType } from '../../../../shared/constants/event-type';
import { SuggestedFixType } from '../../../../shared/constants/suggested-fix-type';
import { EventCard } from '../../../../shared/types/entities/event';
import { SuggestedFix } from '../../../../shared/types/entities/suggested-fix';
import { ApiService } from '../../services/api/api.service';
import { AuthService } from '../../services/auth/auth.service';
import { MetaTagsService } from '../../services/meta-tags/meta-tags.service';
import { ResolvedDataService } from '../../services/resolver/resolve.service';
import { PopupService } from '../../shared/popup/popup.service';
import { cleanIconCode } from '../../util/icon-codes';

export interface EventResolveData {
  event: EventCard;
  suggestedFixes: SuggestedFix<EventCard>[];
}

@Component({
  selector: 'gdb-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.scss'],
  providers: [ResolvedDataService],
})
export class EventPageComponent implements OnInit, OnDestroy {
  prevIcon = faArrowCircleLeft;
  upIcon = faArrowCircleUp;
  nextIcon = faArrowCircleRight;
  fixIcon = faWrench;
  offIcon = faPowerOff;
  loadIcon = faTruckLoading;
  diffIcon = faCodeBranch;
  saveIcon = faSave;

  event: EventCard;
  suggestedFixes: SuggestedFix<EventCard>[];

  header: string;
  showDiffPopup: boolean;
  diffToView: EventCard;

  dbEvent: EventCard;

  editable = false;

  isAdmin = false;
  fixType: SuggestedFixType;

  private routerSub: Subscription;

  constructor(
    private api: ApiService,
    private popupService: PopupService,
    private resolvedDataService: ResolvedDataService<EventResolveData>,
    private metaService: MetaTagsService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.setupEvent());

    this.setupEvent();
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

  setupEvent() {
    this.event = this.resolvedDataService.get('event');
    this.dbEvent = cloneDeep(this.event);
    this.suggestedFixes = this.resolvedDataService.get('suggestedFixes') || [];

    this.isAdmin = this.authService.isAdmin();
    this.fixType = this.event.type === EventType.City ? SuggestedFixType.CityEvent : SuggestedFixType.RoadEvent;

    this.header = `${this.event.type} Event ${this.event.number}`;

    const cleanText = cleanIconCode(this.event.text);

    this.metaService.updateTags({
      title: this.header,
      description: cleanText,
      image: this.event.imageUrl,
      keywords: [`${this.event.type} Event ${this.event.number}`, `${this.event.type} Event`],
    });
  }

  openPopup(event: EventCard) {
    this.diffToView = event;
    this.showDiffPopup = true;
  }

  async commitFix(fix: SuggestedFix<EventCard>) {
    await this.api.commitFix({ id: fix.id });
    this.suggestedFixes = await this.api.getMatchingSuggestedFixes<EventCard>(this.fixType, this.event.number + '');
  }

  closePopup() {
    this.diffToView = null;
    this.showDiffPopup = false;
  }

  loadSuggestedFix(event: EventCard) {
    this.event = event;
  }

  async submitFix(suggestedFix: SuggestedFix<EventCard>) {
    this.editable = false;

    // TODO message for submitting same event
    const anyTheSame =
      isEqual(suggestedFix.data, this.dbEvent) || this.suggestedFixes.some((sf) => isEqual(sf.data, suggestedFix.data));

    if (anyTheSame) {
      return;
    }

    await this.api.suggestFix<EventCard>(suggestedFix);
    this.suggestedFixes = await this.api.getMatchingSuggestedFixes<EventCard>(this.fixType, this.event.number + '');
  }

  reset() {
    this.editable = false;
    this.event = cloneDeep(this.dbEvent);
  }

  trackById<T extends { id: string } = { id: string }>(index: number, data: T) {
    if (!data) {
      return null;
    }

    return data.id;
  }
}
