#!/usr/bin/env python
import json
import time, os, csv
from httplib import BadStatusLine

# to use, run command: easy_install Py-StackExchange
import stackexchange # https://github.com/lucjon/Py-StackExchange

KEY = 'eJ3BDMYi163Mn8aBjxevdw(('
so = stackexchange.Site(stackexchange.StackOverflow, app_key=KEY, impose_throttling=True)
so.be_inclusive()
pattern = '%Y-%m-%d'

with open("all_langauges_stackoverflow_output.csv", 'w') as f:
	fieldnames = ['tag','year','unanswered','total']
	writer = csv.DictWriter(f, fieldnames=fieldnames)
	writer.writeheader()

	with open('kimonoData.json') as json_data:
		d = json.load(json_data)

		for result in d["results"]["collection1"]:
			tag = result["Languages"]["text"]
			for year in range(2007,2015):
				epoch_from = time.mktime(time.strptime(str(year) + '-01-01', pattern))
				epoch_to = time.mktime(time.strptime(str(year) + '-12-31', pattern))

				try:
					questions_unanswered = so.questions.unanswered(fromdate=epoch_from,todate=epoch_to,order='desc',sort='activity',tagged=tag)
					questions_all = so.questions(fromdate=epoch_from,todate=epoch_to,order='desc',sort='activity',tagged=tag)

					writer.writerow({'tag': tag, 'year': str(year), 'unanswered': str(questions_unanswered.total),'total': str(questions_all.total)})
				except:
					print "Count not fetch"

				print tag + "-" + str(year) # just to make sure it's running

				time.sleep(1) # stackoverflow only allows 30 requests per second
