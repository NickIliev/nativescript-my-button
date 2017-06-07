import { EventData } from 'data/observable';
import { Page } from 'ui/page';
import { StackLayout } from "ui/layouts/stack-layout";

import { MyButton } from "nativescript-my-button";

// Event handler for Page "navigatingTo" event attached in main-page.xml
export function navigatingTo(args: EventData) {

    let page = <Page>args.object;
    
    let stack = <StackLayout>page.getViewById("st");

    let myButton = new MyButton();
    myButton.text = "My Button";

    stack.addChild(myButton);
}