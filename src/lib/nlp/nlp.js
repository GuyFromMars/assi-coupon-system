import { containerBootstrap } from '@nlpjs/core';
import { Nlp } from '@nlpjs/nlp';
import { LangEn } from '@nlpjs/lang-en-min';

let nlpInstance;

export async function getNlp() {
  if (!nlpInstance) {
    const container = await containerBootstrap();
    container.use(Nlp);
    container.use(LangEn);

    const nlp = container.get('nlp');
    nlp.settings.autoSave = false; // disable file writing
    nlp.addLanguage('en');

    // Training data
    nlp.addDocument('en', 'hello', 'greetings.hello');
    nlp.addDocument('en', 'hi', 'greetings.hello');
    nlp.addDocument('en', 'howdy', 'greetings.hello');
    nlp.addDocument('en', 'goodbye', 'greetings.bye');
    nlp.addDocument('en', 'bye', 'greetings.bye');
    nlp.addDocument('en', 'see you later', 'greetings.bye');
    nlp.addDocument('en', 'how are you', 'greetings.howareyou');

    nlp.addAnswer('en', 'greetings.hello', 'Hey there! 👋');
    nlp.addAnswer('en', 'greetings.hello', 'Greetings!');
    nlp.addAnswer('en', 'greetings.bye', 'Till next time!');
    nlp.addAnswer('en', 'greetings.bye', 'See you soon!');
    nlp.addAnswer('en', 'greetings.howareyou', "I'm doing well, thanks!");

    await nlp.train();

    nlpInstance = nlp;
  }
  return nlpInstance;
}
