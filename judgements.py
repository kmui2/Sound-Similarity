#!/usr/bin/env python
from datetime import datetime
import webbrowser
import string
import sys
import requests

from unipath import Path
import pandas
import numpy

class Trials(object):
    def __init__(self, seed=None, completed_csv=None):
        
        self.isNew = False;
        # Start with info for (gen i, gen i + 1) edges.
        edges = pandas.read_csv('linear_edges.csv')

        try:
            # TODO Need to make completed and previous data files
            previous_data = pandas.read_csv(completed_csv)
            completed_edges = Trials.edges_to_sets(previous_data)
        except:
            self.isNew = True
            trials = edges  # all trials are new
        else:
            trials = Trials.remove_completed_trials(edges, completed_edges)

        self.random = numpy.random.RandomState(seed)
        trials['reversed'] = self.random.choice(range(2), len(trials))
        trials['category'] = Trials.determine_imitation_category(trials.sound_x)
        # Assumes that sound_x and sound_y come from the same category!

        categories = trials.category.unique()
        self.random.shuffle(categories)
        category_blocks = pandas.DataFrame({'category': categories})
        category_blocks.insert(0, 'block_ix', range(1, len(categories)+1))
        trials = trials.merge(category_blocks)
        trials = trials.sort_values('block_ix').reset_index(drop=True)
        trials.insert(0, 'trial_ix', range(1, len(trials)+1))

        self.trials = trials

    def blocks(self):
        blocks = [block.itertuples() for _, block in self.trials.groupby('category')]
        return blocks

    @staticmethod
    def remove_completed_trials(edges, completed_edges):
        is_unfinished = (pandas.Series(Trials.edges_to_sets(edges),
                                       index=edges.index)
                               .apply(lambda x: x not in completed_edges))
        unfinished = edges[is_unfinished]
        return unfinished

    @staticmethod
    def edges_to_sets(edges):
        stem = lambda x: Trials.get_message_id_from_path(x)
        return [{stem(edge.sound_x), stem(edge.sound_y)}
                for edge in edges.itertuples()]

    @staticmethod
    def get_message_id_from_path(sound_path):
        # e.g., 'path/to/sound/filename.wav' -> 'filename'
        # Also needs to be able to handle sound_path == numpy.int64
        try:
            message_id = Path(sound_path).stem
        except TypeError:
            message_id = Path(int(sound_path)).stem

        return message_id

    @staticmethod
    def determine_imitation_category(audio):
        messages = pandas.read_csv('messages.csv')
        categories = messages[['audio', 'category']].drop_duplicates()
        categories.set_index('audio', inplace=True)
        return categories.reindex(audio).category.tolist()


def get_player_info(name):
    info = {'Name': name}
    # dlg = gui.DlgFromDict(info, title='Similarity Judgments')
    # if not dlg.OK:
    #     core.quit()
    clean = {key.lower(): value for key, value in info.items()}
    return clean


if __name__ == '__main__':
    name = sys.argv[1]
    player = get_player_info(name)

    # Gets time
    start_time = datetime.now()
    player['datetime'] = start_time
    seed = start_time.toordinal()

    fname = 'public/data/judgments/' + player['name'] + '.csv'

    # Make the trials for this participant.
    trials = Trials(seed=seed, completed_csv=fname)
    r = requests.post('http://localhost:8000/trials', data = {'data': trials.trials.to_json(orient="split"), 'isNew': str(trials.isNew), 'name': name })

    print {'data': trials.trials.to_json(orient="split"), 'isNew': str(trials.isNew), 'name': name }

    # judgments = SimilarityJudgments(player, overwrite=False)
    # judgments.run()
