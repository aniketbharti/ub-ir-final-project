import {
  Component,
  Inject,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';

@Component({
  selector: 'app-reply-modal',
  templateUrl: './reply-modal.component.html',
  styleUrls: ['./reply-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReplyModalComponent implements OnInit {
  emojiIcon: any = {
    Happy:
      'https://www.clipartmax.com/png/middle/283-2834862_happy-smile-emoji-emoticon-icon-smiley.png',
    Neutral:
      'https://www.clipartmax.com/png/middle/263-2637285_neutral-emoji-png-transparent-background-rh-clipart-community-college-of-the-air.png',
    Negative:
      'http://cdn.shopify.com/s/files/1/1061/1924/products/Sad_Face_Emoji_grande.png?v=1571606037',
  };
  datavar: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<ReplyModalComponent>,
    @Inject(MAT_DIALOG_DATA) public replyData: any
  ) {
    this.datavar = this.manipulateDisplaySentiment(replyData);
  }

  ngOnInit(): void {}

  manipulateDisplaySentiment(data: any[]) {
    data.forEach((element) => {
      delete element['sentiments']['compound'];
      debugger;
      let data = _(element['sentiments'])
        .toPairs()
        .orderBy([1], ['desc'])
        .fromPairs()
        .value();
      let key = Object.keys(data)[0];
      let displaySentiment = null;
      if (key == 'neu') {
        displaySentiment = 'Neutral';
      } else if (key == 'neg') {
        displaySentiment = 'Negative';
      }
      if (key == 'pos') {
        displaySentiment = 'Postive';
      }
      element['sentimentstring'] = displaySentiment;
      element['sentimentvalue'] = data[key];
      element['sentimentgraph'] = [
        {
          name: 'User',
          series: [
            {
              name: 'Positive',
              value: element['sentiments']['pos'] * 100,
            },
            {
              name: 'Neutral',
              value: element['sentiments']['neu'] * 100,
            },
            {
              name: 'Negative',
              value: element['sentiments']['neg'] * 100,
            },
          ],
        },
      ];
    });
    return data;
  }
}
