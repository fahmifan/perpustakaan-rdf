#!/usr/bin/python3

from lxml import html
import requests
import time
import csv

base_url = 'https://lib.unpad.ac.id'
page_url = base_url + '/index.php?search=Search&keywords=&filterby[node]=Fakultas%20Matematika%20dan%20Ilmu%20Pengetahuan%20Alam&filterby[gmd]=Text&page=20'
page = requests.get(page_url)
tree = html.fromstring(page.content)

# get books
books = tree.xpath('//div[@class="item biblioRecord uk-text-center "]')

# url to the book
book_links = []
for b in books:
	links = b.xpath('//div[@class="detail-list"]//a')
	for l in links:
		book_links.append(l.attrib['href'])

# get book dom
book_pages = []
for l in book_links:
	# book_pages.append(pool.apply_async(requests.get, args=[base_url + l], callback=on_success, error_callback=on_error))
	try:
		b = requests.get(base_url + l, timeout=1)
		book_pages.append(b)
	except:
		continue

# get array of [title, author, library, publisher, categories]
book_datas = []
for b in book_pages:
	try:
		ptree = html.fromstring(b.content)
		item = (ptree.xpath('//table[@class="s-table uk-table"]/tr'))[0]

		title = ptree.xpath('//h3[@class="s-detail-title"]/text()')
		author = ptree.xpath('//div[@property="author"]/a/text()')
		lib = item.xpath('//div[@itemprop="alternativeHeadline"]/b/text()')
		pubs = item.xpath('//td//span[@itemprop="publisher"]/text()')
		categories = item.xpath('//div[@class="s-subject"]/a/text()')

		book = []
		book.append(title[0])
		book.append(author[0])
		book.append(lib[0])
		book.append(pubs[0])
		book.append(';'.join(categories))

		book_datas.append(book)
	except:
		continue

# write to csv file
with open('./input/data.csv', 'w', newline='') as csvfile:
	writer = csv.writer(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
	writer.writerow(['Title', 'Author', 'Library', 'Publisher', 'Category'])
	writer.writerows(book_datas)